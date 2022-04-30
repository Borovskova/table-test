import { BehaviorSubject, combineLatest, map, Observable, startWith, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ITHeaders, ITUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  private users$ = new BehaviorSubject<ITUser[]>([]);
  private sortingHeader$ = new BehaviorSubject<any>(null);
  public headers: Array<ITHeaders> = [
    { label: '№', isSort: false },
    { label: 'Name', isSort: false },
    { label: 'Nickname', isSort: false },
    { label: 'E-mail', isSort: false },
  ];
  public searchForm: FormGroup = new FormGroup({ "keyword": new FormControl('') });
  public filteredUsers$?: Observable<ITUser[]>;



  constructor(private dataService: DataService) {
    // this.filteredUsers$ = combineLatest([
    //   this.users$,
    //   (this.searchForm.get('keyword')?.valueChanges as Observable<string>).pipe(startWith('')),
    //   this.sortingHeader$
    // ]).pipe(
    //   map(([users, keyword, sort]: [Array<ITUser>, string, any]) => {
    //     if(sort != null){
    //       if(sort.label.toLowerCase() === 'name'){
    //        users.sort((a:ITUser, b:ITUser) => {
    //         if(sort.isSort && a.name > b.name){
    //           return -1
    //         }else if (!sort.isSort && a.name < b.name){
    //           return -1
    //         }return 0
    //        })
    //       }
    //       if(sort.label.toLowerCase() === 'nickname'){
    //         users.sort((a:ITUser, b:ITUser)=> {
    //          if(sort.isSort && a.username > b.username){
    //            return -1
    //          }else if (!sort.isSort && a.username < b.username){
    //            return -1
    //          }return 0
    //         })
    //        }
    //     }
    //     if (!users) {
    //       return [];
    //     }
    //     return users.filter((user: ITUser) => {
    //       if (!user) {
    //         return false;
    //       }else{
    //         const pathName = this._getPath(user.name, keyword);
    //         const pathNick = this._getPath(user.username, keyword);
    //         const pathEmail = this._getPath(user.email, keyword);

    //         return pathName || pathNick || pathEmail || false
    //       }  
    //     })

    //   })
    // )
  }

  ngOnInit(): void {
    this._getData()
    this.makeFilteredArray()
  }


  private _getData() {
  this.dataService.getData().pipe(take(1)).subscribe(
      (value: ITUser[]) => {
        this.users$.next(value);
      }
    )
  }
  private makeFilteredArray() {
    this.filteredUsers$ = combineLatest([
      this.users$,
      (this.searchForm.get('keyword')?.valueChanges as Observable<string>).pipe(startWith('')),
      this.sortingHeader$
    ]).pipe(
      map(([users, keyword, sort]: [Array<ITUser>, string, any]) => {
        if (sort != null) {
          if (sort.label.toLowerCase() === 'name') {
            users.sort((a: ITUser, b: ITUser) => {
              if (sort.isSort && a.name > b.name) {
                return -1
              } else if (!sort.isSort && a.name < b.name) {
                return -1
              } return 0
            })
          }
          if (sort.label.toLowerCase() === 'nickname') {
            users.sort((a: ITUser, b: ITUser) => {
              if (sort.isSort && a.username > b.username) {
                return -1
              } else if (!sort.isSort && a.username < b.username) {
                return -1
              } return 0
            })
          }
        }
        if (!users) {
          return [];
        }
        return users.filter((user: ITUser) => {
          if (!user) {
            return false;
          } else {
            const pathName = this._getPath(user.name, keyword);
            const pathNick = this._getPath(user.username, keyword);
            const pathEmail = this._getPath(user.email, keyword);

            return pathName || pathNick || pathEmail || false
          }
        })

      })
    )
  }
  private _getPath(obj: string, keyword: string): boolean {
    return obj.toLowerCase().indexOf(keyword.toLowerCase()) != -1
  }
  public sortBy(header: ITHeaders) {
    header.isSort = !header.isSort;
    this.sortingHeader$.next(header)
  }
}
