import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentHttpModule, ITdHttpInterceptor } from '@covalent/http';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';
import { VantageUserModule } from '@td-vantage/ui-platform/user';
import { VantageSystemModule } from '@td-vantage/ui-platform/system';
import { VantageAuthenticationModule, VantageAuthenticationInterceptor } from '@td-vantage/ui-platform/auth';
import { VantageUserFeedbackModule } from '@td-vantage/ui-platform/utilities';
import { AppComponent } from './app.component';
import { appRoutes, appRoutingProviders } from './app.routes';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { getSelectedLanguage, SUPPORTED_LANGS } from '@shared/utils/translate';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CovalentNavLinksModule } from '@covalent/core/nav-links';
import { VantageThemeModule } from '@td-vantage/ui-platform/theme';
import { CovalentStepsModule } from '@covalent/core/steps';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { SourcesComponent } from './sources/sources.component';
import { SourceFormComponent } from './sources/form/form.component';
import { KafkaService, IKafka } from '../services/kafka.service';
import { ListenerService, ISystem, ISource, ITarget } from '../services/listener.service';
import { KafkaconnectService } from '../services/kafkaconnect.service';
import { ErrorService } from '../services/error.service';
import { JWTDataService } from '../services/jwt-data.service';
import { LoginService } from '../services/login.service';
import { AuthenticationInterceptor } from '../config/interceptors/authentication.interceptor'

const httpInterceptorProviders: Type<ITdHttpInterceptor>[] = [VantageAuthenticationInterceptor, AuthenticationInterceptor];

@NgModule({
  // directives, components, and pipes owned by this NgModule
  declarations: [AppComponent, MainComponent, DashboardComponent, CopyrightComponent, SourcesComponent, SourceFormComponent],
  imports: [
    appRoutes,
    // Angular Modules
    HttpClientModule,
    HttpClientXsrfModule.withOptions(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    // Material Modules
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    MatTooltipModule,
    // Vantage UI Platform
    VantageAuthenticationModule,
    VantageUserModule,
    VantageSystemModule,
    VantageUserFeedbackModule,
    VantageThemeModule,
    // Covalent Modules
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentDialogsModule,
    CovalentLoadingModule,
    CovalentBaseEchartsModule,
    CovalentNavLinksModule,
    CovalentStepsModule,
    TranslateModule.forRoot(),
    CovalentHttpModule.forRoot({
      interceptors: [
        {
          interceptor: VantageAuthenticationInterceptor,
          paths: ['**'],
        },
        {
          interceptor: AuthenticationInterceptor,
          paths: ['/listener/appservices/*'],
        },
      ],
    }),
  ],
  // additional providers needed for this module
  providers: [
    appRoutingProviders,
    httpInterceptorProviders,
    ErrorService,
    LoginService,
    JWTDataService,
    KafkaService,
    ListenerService,
    KafkaconnectService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translateService: TranslateService) {
    // set the default language
    translateService.setDefaultLang('en');
    translateService.addLangs(SUPPORTED_LANGS);

    // Get selected language and load it
    const selectedLanguage: string = getSelectedLanguage(translateService);

    // using require here so can avoid making an http request ajax to get the language files
    // this prevents the language keys from flashing on the screen for a second before the actual
    // language files are loaded

    /* tslint:disable-next-line */
    const data: any = require('../../assets/i18n/' + selectedLanguage + '.json');
    translateService.setTranslation(selectedLanguage, data, false);
    translateService.use(selectedLanguage);
  }
}
