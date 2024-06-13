import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ChatModel } from '../../models/chat.model';
import { UserModel } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import * as  signalR from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  users : UserModel[] = [];
  chats : ChatModel[] = [];
  selectedUserId: string = "";
  selectedUser: UserModel = new UserModel();
  yourself = new UserModel();
  hub:signalR.HubConnection | undefined;
  message:string = "" ;


  constructor(private http: HttpClient ){
    this.yourself = JSON.parse(localStorage.getItem("accessToken") ?? "");
    this.getUsers();

    this.hub = new signalR.HubConnectionBuilder().withUrl("https://localhost:7203/chat-hub", {withCredentials:true}).build();
    this.hub.start().then(()=>{
      console.log("Connection is started...");

    this.hub?.invoke("Connect",this.yourself.id);
    this.hub?.on("Users",(res:UserModel)=>{
      console.log(res);
      this.users.find(x=>x.id == res.id)!.status = res.status;
    });

    this.hub?.on("Messages",(res:ChatModel)=>{
      console.log(res);
      if(this.selectedUserId == res.userId){
        this.chats.push(res);
      }
    })

    })
  }

  getUsers(){
    this.http.get<UserModel[]>("https://localhost:7203/api/Chats/GetUsers").subscribe(res=>{
      this.users = res.filter(p=>p.id != this.yourself.id);
    });
  }

  changeUser(user: UserModel){
    this.selectedUserId = user.id;
    this.selectedUser = user;

    this.http.get(`https://localhost:7203/api/Chats/GetChats?userId=${this.yourself.id}&toUserId=${this.selectedUserId}`)
    .subscribe((res:any)=>{
      this.chats = res;
    });
  }

  sendMessage(){

    const data = {
      "userId": this.yourself.id,
      "toUserId": this.selectedUserId,
      "message": this.message
    }
    if(this.message != "")
      {
        this.http.post<ChatModel>("https://localhost:7203/api/Chats/SendMessage",data).subscribe(
        (res)=>{
        this.chats.push(res);
        this.message="";
        });
      }
  }

  logout(){
    localStorage.clear();
    document.location.reload();
  }

}





