import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Task } from './model/task';
import { statuses } from './data';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selected: Task;
  editMode = false;
  display = false;
  tasks: Task[] = [];
  statuses = statuses;
  showComplete = true;
  cols = [
    { field: 'summary', header: 'Summary' },
    { field: 'status', header: 'Status' },
    { field: 'date', header: 'Due Date' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.selected = new Task;
  }

  ngOnInit(): void {
    const temp: Task[] = [];
    this.http.get(environment.apiUrl)
      .subscribe(
      res => {
        res['data'].forEach(r => {
          temp.push(
            new Task(r.id, r.summary, r.description, r.due_date, r.status)
          );
        });
      },
      err => { },
      () => this.tasks = [...temp]
    );
  }

  showDialog() {
    this.display = true;
  }

  onChange(e, task) {
    if (e.checked) {
      task.status = { name: 'Completed', code: true };
      this.http.put(`${environment.apiUrl}/status/${task.id}`, { name: 'Completed', code: true })
        .subscribe(res => {
          console.log('res', res);
        });
      this.messageService.add({ severity: 'success', summary: 'Status update', detail: `${task.summary} - Completed` });
    } else {
      task.status = { name: 'Pending', code: false };
      this.http.put(`${environment.apiUrl}/status/${task.id}`, { name: 'Pending', code: false })
        .subscribe(res => {
          console.log('res', res);
        });
      this.messageService.add({ severity: 'info', summary: 'Status update', detail: `${task.summary} - Pending` });
    }
  }

  onChangeStatus(e, task) {
    this.http.put(`${environment.apiUrl}/status/${task.id}`, {...e.value})
      .subscribe(res => {
        console.log('res', res);
      });
    this.messageService.add({ severity: 'info', summary: 'Status update', detail: `Task status update - ${e.value.name}` });
  }

  delete({ id, summary }) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this task?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.http.delete(`${environment.apiUrl}/${id}`)
          .subscribe(res => {
            console.log(res);
          });
        this.messageService.add({ severity: 'success', summary: 'Task update', detail: `${summary} - deleted` });
      },
      reject: () => { }
    });
  }

  submitNewTask(summary, date, desc) {
    this.tasks = [...this.tasks, new Task(null, summary.value, desc.value, date.value)];
    this.messageService.add({ severity: 'success', summary: 'New task', detail: `${summary.value} - New task` });
    const payload = { summary: summary.value, desc: desc.value, date: date.value.toLocaleDateString() };
    this.http.post(environment.apiUrl, payload)
      .subscribe(
        res => {
          this.tasks = this.tasks.map(t => {
            if (!t.id) {
              t.id = res['id'];
            }
            return t;
          });
        },
        err => {},
        () => {
          summary.value = '';
          date.value = null;
          date.updateInputfield();
          desc.value = '';
        }
      );
  }

  cancelNewTask(summary, date, desc) {
    summary.value = '';
    date.value = null;
    date.updateInputfield();
    desc.value = '';
  }

  onEdit(task) {
    this.selected.id = task.id;
    this.selected.summary = task.summary;
    this.selected.date = new Date(task.date);
    this.selected.status = task.status;
    this.selected.description = task.description;
    this.editMode = true;
  }

  updateTask() {
    const { id } = this.selected;
    this.tasks = this.tasks.map(
      t => t.id === id
        ? this.selected
        : t
    );
    this.http.put(`${environment.apiUrl}/${id}`, {
      id,
      summary: this.selected.summary,
      desc: this.selected.description,
      date: this.selected.date.toLocaleDateString()
    })
      .subscribe(res => {
        console.log(res);
      });
    this.messageService.add({ severity: 'success', summary: 'Task update', detail: `${this.selected.summary} - update` });
    this.selected = new Task;
  }

  toggleCompleted(e) {
    const temp: Task[] = [];
    if (e) {
      this.http.get(environment.apiUrl)
        .subscribe(
          res => {
            res['data'].forEach(r => {
              temp.push(
                new Task(r.id, r.summary, r.desc, r.due_date, r.status)
              );
            });
          },
          err => { },
          () => this.tasks = [...temp]
        );
    } else {
      this.http.get(environment.apiUrl)
        .subscribe(
          res => {
            console.log('res', res);
            res['data'].forEach(r => {
              if (r.status.name !== 'Completed') {
                temp.push(
                  new Task(r.id, r.summary, r.desc, r.due_date, r.status)
                );
              }
            });
          },
          err => { },
          () => this.tasks = [...temp]
        );
    }
  }
}
