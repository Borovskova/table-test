import { take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ITHeaders, ITUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-second-table',
  templateUrl: './second-table.component.html',
  styleUrls: ['./second-table.component.scss']
})
export class SecondTableComponent implements OnInit {

  private users: ITUser[] = [];
  public filteredUsers: ITUser[] = [];
  public keyword: string = '';
  public headers: Array<ITHeaders> = [
    { label: '№', isSort: false },
    { label: 'Name', isSort: false },
    { label: 'Nickname', isSort: false },
    { label: 'E-mail', isSort: false },
  ];
 


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this._getData()
  }

  private _getData() {
  this.dataService.getData().pipe(take(1)).subscribe(
      (value: ITUser[]) => {
        this.users = value;
        this.filteredUsers = this.users;
      }
    )
  }
  private _getExpression(obj: string): boolean {
    return obj.toLowerCase().indexOf(this.keyword.toLowerCase()) != -1
  }
  public onInput() {
    this.filteredUsers = [];
    this.filteredUsers = this.users.filter((user: ITUser) => this._getExpression(user.name) || this._getExpression(user.username) || this._getExpression(user.email))
  }
  public sortBy(header:ITHeaders) {
    header.isSort = !header.isSort;

    if (header.label.toLowerCase() === 'name') {
      this.filteredUsers = this.filteredUsers.sort((a: ITUser, b: ITUser) => {
        if (header.isSort && a.name > b.name) {
          return -1
        } else if (!header.isSort && a.name < b.name) {
          return -1
        } return 0
      })
    }
    if (header.label.toLowerCase() === 'nickname') {
      this.filteredUsers = this.filteredUsers.sort((a: ITUser, b: ITUser) => {
        if (header.isSort && a.username > b.username) {
          return -1
        } else if (!header.isSort && a.username < b.username) {
          return -1
        } return 0
      })
    }
  }


}
