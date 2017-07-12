import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {  MaterialModule,
          MdListModule,
          MdGridListModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DndModule } from 'ng2-dnd';


import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { TopicService } from './services/topic.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { TopicsComponent } from './topics/topics.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CategoryFilterPipe } from './services/category-filter.pipe';
import { DialogEdit, DialogAdd } from './topics/manipulateTopics/manipulateDialog.component';
import { DialogFollowCategories } from './topics/followCategories/followCategoryDialog.component';
import {CategoryService} from "./services/category.service";
import { ManipulationService } from "./services/manipulation.service";
import {ArticleSelectionComponent} from './article-selection/article-selection.component';
import { ArticleService } from "./services/article.service";
import { ArticleFilterPipe } from './article-selection/article-search-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    TopicsComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    DialogEdit,
    DialogAdd,
    DialogFollowCategories,
    CategoryFilterPipe,
    ArticleSelectionComponent,
    ArticleFilterPipe
  ],
  imports: [
    RoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    FlexLayoutModule,
    MdListModule,
    MdGridListModule,
    DndModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    TopicService,
    CategoryService,
    ManipulationService,
    DndModule,
    ArticleService
  ],
  entryComponents: [
    DialogEdit,
    DialogAdd,
    DialogFollowCategories
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
