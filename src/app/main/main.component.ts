import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Task } from '../models/Task';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  selectedTask:Task;
  jsonArr:any[]=[];
  list:Task[];
  inProcessList:Task[]=[];
  completedList:Task[]=[];
  list1:any;
  percent:any=0;
  percentclass:string="";

  ngOnInit(): void {
    this.Reset();
    debugger;
  
  if(localStorage.getItem('PendingTaskList') != "" && localStorage.getItem('PendingTaskList')!=null && localStorage.getItem('PendingTaskList')!= undefined)
  { 
    debugger;
    let str1=localStorage.getItem('PendingTaskList').toString();    
    this.list=JSON.parse(str1);
    let str2=localStorage.getItem('InProcessTaskList').toString();    
    this.inProcessList=JSON.parse(str2);
    let str3=localStorage.getItem('CompletedTaskList').toString();    
    this.completedList=JSON.parse(str3);
  } 
  this.CalculatePercent();
  }

  OpenAddTaskPopup()
  {
    debugger;
    document.getElementById("modalAddTask").style.display="block";
    document.getElementById("Role_Overley").style.display="block";
  }

  CloseAddTaskPopup()
  {
    debugger;
    document.getElementById("modalAddTask").style.display="none";
    document.getElementById("Role_Overley").style.display="none";
  }

  SaveTask(form:NgForm)
  {
    debugger;
    if(form.form.value != null && form.form.value != undefined && form.form.value.Id =='')
    {
      if(localStorage.getItem('PendingTaskList') != "" && localStorage.getItem('PendingTaskList')!=null && localStorage.getItem('PendingTaskList')!= undefined)
      {
        this.jsonArr=JSON.parse(localStorage.getItem('PendingTaskList'));
        this.list=JSON.parse(localStorage.getItem('PendingTaskList'))
      }
        
      let json=form.form.value;    
      this.jsonArr.push(json);
      localStorage.setItem("PendingTaskList",JSON.stringify(this.jsonArr).replace(`"Id":""`,`"Id":"`+(this.jsonArr.length + 1)+`"`));
     
    }
    else
    {
      this.list.find(item => item.Id == form.form.value.Id).Title = form.form.value.Title;
      this.list.find(item => item.Id == form.form.value.Id).Priority = form.form.value.Priority;
      this.list.find(item => item.Id == form.form.value.Id).Date = form.form.value.Date;
      this.list.find(item => item.Id == form.form.value.Id).Description = form.form.value.Description;
      localStorage.setItem("PendingTaskList",JSON.stringify(this.list));
    }
    
    let str=localStorage.getItem('PendingTaskList').toString();    
    this.list=JSON.parse(str);
    document.getElementById("modalAddTask").style.display="none";
    document.getElementById("Role_Overley").style.display="none";
    this.CalculatePercent();
  }

  onDrop(event:any)
  {
    debugger;
    if(localStorage.getItem('InProcessTaskList') != "" && localStorage.getItem('InProcessTaskList')!=null && localStorage.getItem('InProcessTaskList')!= undefined)
      this.inProcessList=JSON.parse(localStorage.getItem('InProcessTaskList'))
    this.inProcessList.push(event.dragData);
    this.list = this.list.filter(obj => obj.Id !== event.dragData.Id);
    localStorage.setItem("InProcessTaskList",JSON.stringify(this.inProcessList));
    localStorage.setItem("PendingTaskList",JSON.stringify(this.list));

  }

  onDropComplete(event:any)
  {
    debugger;
    if(localStorage.getItem('CompletedTaskList') != "" && localStorage.getItem('CompletedTaskList')!=null && localStorage.getItem('CompletedTaskList')!= undefined)
      this.completedList=JSON.parse(localStorage.getItem('CompletedTaskList'))
    this.completedList.push(event.dragData);
    this.inProcessList = this.inProcessList.filter(obj => obj.Id !== event.dragData.Id);
    localStorage.setItem("CompletedTaskList",JSON.stringify(this.completedList));
    localStorage.setItem("InProcessTaskList",JSON.stringify(this.inProcessList));
    this.CalculatePercent();
  }

  EditTask(task:Task)
  {
    debugger;
    this.selectedTask=task;
    this.selectedTask.Date=new Date(task.Date);
    document.getElementById("modalAddTask").style.display="block";
    document.getElementById("Role_Overley").style.display="block";
  }

  DeleteTask(Id:any,section:any)
  {
    debugger;
    if(confirm("Are you sure you want to delete this task?") == true)
    {
      if(section =="Pending")
      {
        this.list = this.list.filter(x=> x.Id !== Id); 
        localStorage.setItem("PendingTaskList",JSON.stringify(this.list));       
      }
      else if(section == "InProcess")
      {
        this.inProcessList = this.list.filter(x=> x.Id !== Id); 
        localStorage.setItem("InProcessTaskList",JSON.stringify(this.inProcessList));       
      }
    }
    this.CalculatePercent();
  }

  CalculatePercent()
  {
    debugger;
    let per = 0;
    let l1=this.list.length;
    let l2=this.inProcessList.length;
    let l3=this.completedList.length;
    this.percent = (l3/(l1+l2+l3))*100;
    if(this.percent > 0)
    this.percent=parseFloat(this.percent).toFixed(2);

    if(this.percent < 33)
      this.percentclass="classred";
    else if(this.percent > 33 && this.percent < 66)
      this.percentclass="classamber";
    else if(this.percent > 66)
      this.percentclass="classgreen";
  }
  
  Reset()
  {
    this.selectedTask={
      Id:"",
      Title:"",
      Priority:"",
      Date:null,
      Description:""
      
    };
  }

}
