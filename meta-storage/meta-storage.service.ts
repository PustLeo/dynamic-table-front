import {EventEmitter, Inject, Injectable} from "@angular/core";
import {AuthService} from "@hospital/auth-module";
import {of, Subject, throwError} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {CommonStaticService} from "@hospital/shared-module";
import {Observable} from "rxjs/internal/Observable";
import {catchError, switchMap, take, tap, filter, finalize, map} from "rxjs/operators";
import {TableNamesEnum} from "@utils/sockets/meta-storage/table-columns/table-names.enum";
import {MetaStorageActionsEnum} from "@utils/sockets/meta-storage/utils/meta-storage-actions.enum";
import {MetaStorageEventsEnum} from "@utils/sockets/meta-storage/utils/meta-storage-events.enum";

@Injectable()
export class MetaStorageService {
  protected eventsEmitter: EventEmitter<any> = new EventEmitter<any>();
  public events: Observable<any> = this.eventsEmitter.asObservable();
  protected streams: Subject<void> = new Subject<void>();
  protected socket = webSocket({
    url: this.generateUrl,
    openObserver: {
      next: (event: Event) => this.openHandler(event)
    },
    closeObserver: {
      next: (event: CloseEvent) => this.closeHandler(event)
    }
  });

  constructor(@Inject('AuthService') protected authService: AuthService) {
  }

  public start(): void {
    this.streams.next();
  }

  public setup(): void {
    this.streams.asObservable()
      .pipe(
        switchMap(() => this.socketInstance().asObservable()
          .pipe(catchError((error: any) => this.socketCatchError(error)))),
        tap((event: any) => this.eventsEmitter.emit(event))
      )
      .subscribe();
  }

  protected socketInstance(): WebSocketSubject<any> {
    this.socket = webSocket({
      url: this.generateUrl,
      openObserver: {
        next: (event: Event) => this.openHandler(event)
      },
      closeObserver: {
        next: (event: CloseEvent) => this.closeHandler(event)
      }
    });
    return this.socket;
  }

  protected get generateUrl(): string {
    const authData = CommonStaticService.getTokenInfo();
    const apiSettings = CommonStaticService.getApiSettings();
    const url =  apiSettings.SOCKETS.META_STORAGE.ADDR;
    return url + '?token=' + authData.access_token;
  }

  protected socketCatchError(error: any): Observable<any> {
    return this.authService.handleAuthStatus()
      .pipe(tap(() => this.streams.next()));
  }

  protected openHandler(event: Event): void {
    console.log("Sockets: connect ok");
  }

  protected closeHandler(event: CloseEvent): void {
    if (event.code === 1007) {
      this.socketCatchError({})
        .subscribe();
    }
    console.log("Sockets: close ok");
  }

  public getTableColumns(tableName: TableNamesEnum): Observable<any> {
    return new Observable(subscriber => {
      this.events
        .pipe(
          catchError((error) => {
            subscriber.error(error);
            return throwError(error);
          }),
          filter(({ event, data }) => this.getTableColumnsEventFilter(event, tableName, data)),
          take(1),
          tap(({ data }) => {
            subscriber.next(data?.columns ?? {});
          }),
          finalize(() => subscriber.complete())
        )
        .subscribe();
      this.socket.next({
        event: MetaStorageEventsEnum.TableColumn,
        data: {
          action: MetaStorageActionsEnum.Get,
          tableName
        }
      });
    });
  }

  private getTableColumnsEventFilter(event: MetaStorageEventsEnum, tableName: TableNamesEnum, data: any): boolean {
    return (
      event === MetaStorageEventsEnum.TableColumn &&
      ('tableName' in data) && data.tableName === tableName
    );
  }

  private getTableFiltersEventFilter(event: MetaStorageEventsEnum, tableName: TableNamesEnum, data: any): boolean {
    return (
      event === MetaStorageEventsEnum.TableFilter &&
      ('tableName' in data) && data.tableName === tableName
    );
  }

  private getTableSortEventFilter(event: MetaStorageEventsEnum, tableName: TableNamesEnum, data: any): boolean {
    return (
      event === MetaStorageEventsEnum.TableSort &&
      ('tableName' in data) && data.tableName === tableName
    );
  }

  public setTableColumn(tableName: TableNamesEnum, columns: any): Observable<any> {
    this.socket.next({
      event: MetaStorageEventsEnum.TableColumn,
      data: {
        action: MetaStorageActionsEnum.Set,
        tableName: tableName,
        columns
      }
    });
    return of(true);
  }

  public getTableFilters(tableName: TableNamesEnum): Observable<any> {
    return new Observable(subscriber => {
      this.events
        .pipe(
          catchError((error) => {
            subscriber.error(error);
            return throwError(error);
          }),
          filter(({ event, data }) => this.getTableFiltersEventFilter(event, tableName, data)),
          take(1),
          map(({ data }) => data.filters ?? {}),
          // map((filters: any) => {
          //   const result: any = {};
          //   Object.entries(filters)
          //     .forEach(([key, val]: any[]) => result[key] = val.value);
          //   return result;
          // }),
          tap((data: any) => {
            subscriber.next(data);
          }),
          finalize(() => subscriber.complete())
        )
        .subscribe();
      this.socket.next({
        event: MetaStorageEventsEnum.TableFilter,
        data: {
          action: MetaStorageActionsEnum.Get,
          tableName
        }
      });
    });
  }

  public setTableFilters(tableName: TableNamesEnum, filters: any): Observable<any> {
    this.socket.next({
      event: MetaStorageEventsEnum.TableFilter,
      data: {
        action: MetaStorageActionsEnum.Set,
        tableName: tableName,
        filters
      }
    });
    return of(true);
  }

  public getTableSort(tableName: TableNamesEnum): Observable<any> {
    return new Observable(subscriber => {
      this.events
        .pipe(
          catchError((error) => {
            subscriber.error(error);
            return throwError(error);
          }),
          filter(({ event, data }) => this.getTableSortEventFilter(event, tableName, data)),
          take(1),
          tap(({ data }: any) => {
            subscriber.next({
              sortField: data.sortField,
              sortDir: data.sortDir
            });
          }),
          finalize(() => subscriber.complete())
        )
        .subscribe();
      this.socket.next({
        event: MetaStorageEventsEnum.TableSort,
        data: {
          action: MetaStorageActionsEnum.Get,
          tableName
        }
      });
    });
  }

  public setTableSort(tableName: TableNamesEnum, sortField: string, sortDir: string): Observable<any> {
    this.socket.next({
      event: MetaStorageEventsEnum.TableSort,
      data: {
        action: MetaStorageActionsEnum.Set,
        tableName: tableName,
        sortDir,
        sortField
      }
    });
    return of(true);
  }
}
