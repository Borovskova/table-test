import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ITUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-second-table',
  templateUrl: './second-table.component.html',
  styleUrls: ['./second-table.component.scss']
})
export class SecondTableComponent implements OnInit, OnDestroy {

  private users$: ITUser[] = [];
  public filteredUsers$: ITUser[] = [];
  public keyword: string = '';
  public headers: Array<string> = ['№', 'Name', 'Nickname', 'E-mail'];
  private aSub$?: Subscription;


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this._getData()
  }
  
  private _getData() {
    this.aSub$ = this.dataService.getData().subscribe(
      (value: ITUser[]) => {
        this.users$ = value;
        this.filteredUsers$ = this.users$;
      }
    )
  }
  private _getExpression(obj: string): boolean {
    return obj.toLowerCase().indexOf(this.keyword.toLowerCase()) != -1
  }
  public onInput() {
    this.filteredUsers$ = [];
    this.filteredUsers$ = this.users$.filter((user: ITUser) => this._getExpression(user.name) || this._getExpression(user.username) || this._getExpression(user.email))
  }

  ngOnDestroy() {
    if (this.aSub$) {
      this.aSub$.unsubscribe();
      this.aSub$ = undefined;
    }
  }
}
