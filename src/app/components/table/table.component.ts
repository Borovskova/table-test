import { BehaviorSubject, combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ITUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  private users$ = new BehaviorSubject<ITUser[]>([]);
  public headers: Array<string> = ['№', 'Name', 'Nickname', 'E-mail'];
  public searchForm: FormGroup = new FormGroup({ "keyword": new FormControl('') });
  public filteredUsers$: Observable<ITUser[]>;
  private aSub$: Subscription | undefined;



  constructor(private dataService: DataService) {
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchForm.get('keyword')?.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([users, keyword]: Array<ITUser | any>) => {
        if (!users) {
          return [];
        }
        return users.filter((user: ITUser) => {
          if (!user) {
            return false;
          }
          const pathName = this._getPath(user.name, keyword);
          const pathNick = this._getPath(user.username, keyword);
          const pathEmail = this._getPath(user.email, keyword);

          if (pathName) {
            return pathName
          } else if (pathNick) {
            return pathNick
          }
          return pathEmail
        })
      })
    )
  }

  ngOnInit(): void {
    this._getData()
  }


  private _getData() {
    this.aSub$ = this.dataService.getData().subscribe(
      (value: ITUser[]) => {
        this.users$.next(value);
      }
    )
  }
  private _getPath(obj: string, keyword: string): Object {
    return obj.toLowerCase().indexOf(keyword.toLowerCase()) != -1
  }

  ngOnDestroy() {
    if (this.aSub$) {
      this.aSub$.unsubscribe();
      this.aSub$ = undefined;
    }
  }
}
