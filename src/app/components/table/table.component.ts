import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ITUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  private users$ = new BehaviorSubject<ITUser[]>([]);
  public headers: Array<string> = ['№', 'Name', 'Nickname', 'E-mail'];
  public searchForm: FormGroup = new FormGroup({ "keyword": new FormControl('') });
  public filteredUsers$: Observable<ITUser[]>;


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
          } else if (user.username.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
            return user.username.toLowerCase().indexOf(keyword.toLowerCase()) != -1
          } else if (user.email.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
            return user.email.toLowerCase().indexOf(keyword.toLowerCase()) != -1
          }
          return user.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1
        })
      })
    )
  }

  ngOnInit(): void {
    this._getData()
  }

  private _getData() {
    this.dataService.getData().subscribe(
      (value: ITUser[]) => {
        this.users$.next(value);
      }
    )
  }
}
