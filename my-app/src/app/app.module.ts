import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { OpportunitiesListComponent } from './components/opportunities-list/opportunities-list.component';
import { MainInfoComponent } from './components/main-info/main-info.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { IntroComponent } from './components/intro/intro.component';
import { StudentProfileComponent } from './components/home/student-profile/student-profile.component';
import { StudentProfileMainComponent } from './components/student-profile-main/student-profile-main.component';
import { StudentProfileSkillsComponent } from './components/student-profile-skills/student-profile-skills.component';
import { StudentProfileInfoComponent } from './components/student-profile-info/student-profile-info.component';
import { StudentProfileFeedbackComponent } from './components/student-profile-feedback/student-profile-feedback.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationProfileComponent } from './components/home/organization-profile/organization-profile.component';
import { StudentProfileEditComponent } from './components/student-profile-edit/student-profile-edit.component';
import { OrganizationProfileEditComponent } from './components/organization-profile-edit/organization-profile-edit.component';
import { OrganizationProfileNewTaskComponent } from './components/organization-profile-new-task/organization-profile-new-task.component';
import { OrganizationProfileFeedbackComponent } from './components/organization-profile-feedback/organization-profile-feedback.component';
import { OrganizationProfileTaskListComponent } from './components/organization-profile-task-list/organization-profile-task-list.component';
import { OrganizationProfileRequestListComponent } from './components/organization-profile-request-list/organization-profile-request-list.component';
import { StudentProfileRequestListComponent } from './components/student-profile-request-list/student-profile-request-list.component';
import { OrganizationSendInvitationComponent } from './components/organization-send-invitation/organization-send-invitation.component';
import { AdminProfileComponent } from './components/home/admin-profile/admin-profile.component';
import { AdminProfileFeedbackComponent } from './components/admin-profile-feedback/admin-profile-feedback.component';
import { AdminProfileTasksComponent } from './components/admin-profile-tasks/admin-profile-tasks.component';
import { JwtInterceptorInterceptor } from './helpers/jwt-interceptor.interceptor';
import { OrganizationProfileEditTaskComponent } from './components/organization-profile-edit-task/organization-profile-edit-task.component';
import { StudentProfileAddSkillsComponent } from './components/student-profile-add-skills/student-profile-add-skills.component';
import { StudentProfileSendFeedbackComponent } from './components/student-profile-send-feedback/student-profile-send-feedback.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OpportunitiesListComponent,
    MainInfoComponent,
    FooterComponent,
    SignUpComponent,
    LogInComponent,
    IntroComponent,
    StudentProfileComponent,
    StudentProfileMainComponent,
    StudentProfileSkillsComponent,
    StudentProfileInfoComponent,
    StudentProfileFeedbackComponent,
    StudentListComponent,
    OrganizationListComponent,
    OrganizationProfileComponent,
    StudentProfileEditComponent,
    OrganizationProfileEditComponent,
    OrganizationProfileNewTaskComponent,
    OrganizationProfileFeedbackComponent,
    OrganizationProfileTaskListComponent,
    OrganizationProfileRequestListComponent,
    StudentProfileRequestListComponent,
    OrganizationSendInvitationComponent,
    AdminProfileComponent,
    AdminProfileFeedbackComponent,
    AdminProfileTasksComponent,
    OrganizationProfileEditTaskComponent,
    StudentProfileAddSkillsComponent,
    StudentProfileSendFeedbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
