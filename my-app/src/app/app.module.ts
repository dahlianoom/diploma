import { BrowserModule } from '@angular/platform-browser';
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
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentProfileMainComponent } from './components/student-profile-main/student-profile-main.component';
import { StudentProfileSkillsComponent } from './components/student-profile-skills/student-profile-skills.component';
import { StudentProfileInfoComponent } from './components/student-profile-info/student-profile-info.component';

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
    StudentProfileInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
