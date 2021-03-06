import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organization } from '../../../models/users/organization';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { FetchOrganizationResult } from '../../../models/users/fetchOrganizationModel';
import { map } from 'rxjs/operators';
import { EditOrganizationModel } from '../../../models/editOrganizationModel';
import { NewTaskModel } from 'src/app/models/newTaskModel';
import { TaskModel } from '../../../models/taskModel'
import { EditTaskModel } from 'src/app/models/editTaskModel';
import { RequestionList } from 'src/app/models/requestionList';
import { FeedbackModel } from 'src/app/models/feedbackModel';
import { FeedbackList } from 'src/app/models/feedbackList';

@Injectable({
  providedIn: 'root'
})
export class OrganizationServiceService {

  constructor(private httpClient: HttpClient) { }


  getOrganization(id?: string): Observable<Organization> {
    if (isNullOrUndefined(id)) {
      return this.httpClient.get<FetchOrganizationResult>("http://localhost:8080/self").pipe(
        map(result => result.userData)
      );
    } else {
      return this.httpClient.get<FetchOrganizationResult>(`http://localhost:8080/organization/${id}`).pipe(
        map(result => result.userData)
      );
    }
  }

  editOrganization(id: number, editData: EditOrganizationModel): Observable<EditOrganizationModel> {
    return this.httpClient.post<EditOrganizationModel>('http://localhost:8080/edit_organization/' + id, editData);

  }

  deleteOrganization(id: number): Observable<Organization> {
    return this.httpClient.delete<Organization>('http://localhost:8080/delete_organization/' + id);
  }

  createTask(taskData: NewTaskModel): Observable<NewTaskModel> {
    return this.httpClient.post<NewTaskModel>('http://localhost:8080/create_task', taskData);

  }

  getTasks(id: number): Observable<TaskModel[]> {
    return this.httpClient.get<TaskModel[]>('http://localhost:8080/get_tasks/'+ id);

  }

  getTask(id: string): Observable<TaskModel> {
    return this.httpClient.get<TaskModel>('http://localhost:8080/get_task/'+ id);

  }
  
  editTask(id: number, editData: EditTaskModel): Observable<EditTaskModel> {
    return this.httpClient.post<EditTaskModel>('http://localhost:8080/edit_task/' + id, editData);

  }

  deleteTask(id: number): Observable<TaskModel> {
    return this.httpClient.delete<TaskModel>('http://localhost:8080/delete_task/' + id);

  }

  getRequestions(id: number): Observable<RequestionList[]> {
    return this.httpClient.get<RequestionList[]>('http://localhost:8080/get_requestions/'+ id);

  }

  getResolvedRequestions(id: number): Observable<RequestionList[]> {
    return this.httpClient.get<RequestionList[]>('http://localhost:8080/get_resolved_requestions/'+ id);

  }

  acceptRequestion(id: number) {
    return this.httpClient.post('http://localhost:8080/accept_requestion', {id: id});

  }

  rejectRequestion(id: number) {
    return this.httpClient.post('http://localhost:8080/reject_requestion', {id: id});

  }

  sendFeedback(feedbackData: FeedbackModel): Observable<FeedbackModel> {
    return this.httpClient.post<FeedbackModel>('http://localhost:8080/organization_feedback', feedbackData);
  }

  getFeedback(id: number): Observable<FeedbackList[]> {
    return this.httpClient.get<FeedbackList[]>('http://localhost:8080/organization_feedback_list/' + id);
  }

}
