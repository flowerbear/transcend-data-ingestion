import { ViewChild, Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgForm } from '@angular/forms';

import { VantageSessionService } from '@td-vantage/ui-platform/auth';
import { IUser } from '@td-vantage/ui-platform/user';

import { TdLoadingService } from '@covalent/core/loading';
import { StepState, TdStepComponent } from '@covalent/core/steps';
import { KafkaService, IKafka } from '../../../services/kafka.service';
import { ListenerService, ISystem, ISource, ITarget } from '../../../services/listener.service';
import { KafkaconnectService } from '../../../services/kafkaconnect.service';
import { LoginService } from '../../../services/login.service';
import { ErrorService } from '../../../services/error.service';

export interface ISubscriptionInfo {
  topic: string;
}

export interface ISourceRequestBody {
  subscription_info?: ISubscriptionInfo;
  owner?: string[];
  source_type?: string;
  name?: string;
  description?: string;
}

export interface IDataPath {
  schema?: string;
  table?: string;
}

export interface ISystemInfo {
  host?: string;
  username?: string;
  password?: string;
  port?: string;
  system_type?: string;
}

export interface IDataMap {
  mapping_type?: string;
}

export interface ITargetRequestBody {
  source_id?: string;
  system_id?: string;
  owner?: string[];
  name?: string;
  description?: string;
  target_type?: string;
  data_path?: IDataPath;
  sample_size?: number;
  system_info?: ISystemInfo;
  state?: string;
  production?: boolean;
  bundle?: boolean;
  bundle_type?: string;
  bundle_interval?: number;
  data_map?: IDataMap;
  use_dead_letter_queue?: boolean;
}

export interface IKafkaConnectRequestBody {
  name?: string;
  config?: any;
}

@Component({
  selector: 'source-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SourceFormComponent implements OnInit {

  @ViewChild('kafkaSetupForm', {static: true}) kafkaSetupForm: NgForm;
  @ViewChild('listenerSetupForm', {static: true}) listenerSetupForm: NgForm;
  //@ViewChild('kafkaStep', {static: false}) kafkaStep: TdStepComponent;
  @ViewChild('kafkaConnectStep', {static: false}) kafkaConnectStep: TdStepComponent;
  @ViewChild('kafkaConnectSetupForm', {static: true}) kafkaConnectSetupForm: NgForm;
  @ViewChild('autosize', {static: true}) autosize: CdkTextareaAutosize;

  user: IUser;

  stateKafkaStep: StepState = StepState.None;
  stateListenerStep: StepState = StepState.None;
  stateKafkaConnectStep: StepState = StepState.None;

  kafkaTopic: IKafka = {
    topic: undefined,
    num_partitions: 6,
    replication_factor: 3,
  };

  autofocusSaveConfigBtn: boolean = true;
  //enableKafkaTopicSave: boolean = false;
  kafkaTopicCreateStatus: string;

  listenerJobName: string = undefined;
  listenerJobDescription: string = undefined;

  //kafkaTopics: IKafka[];
  token: string;

  systems: ISystem[];
  system: ISystem;

  username: string;
  password: string;

  batchname: string;
  batchpassword: string;
  schemaName: string;
  tableName: string;

  sourceRequst: ISourceRequestBody = {
    source_type: 'KAFKA',
    owner: [this._vantageSessionService.user.username],
  };

  targetRequest: ITargetRequestBody = {
    target_type: 'teradata',
    owner: [this._vantageSessionService.user.username],
    sample_size: 0,
    system_info: { port: '1025', system_type: 'teradata'},
    state: "1",
    production: false,
    bundle: false,
    bundle_type: "records",
    bundle_interval: 0,
    data_map: {
      mapping_type: "auto_shred"
    },
    use_dead_letter_queue: true
  };

  sourceId: string;
  targetId: string;
  started: boolean = false;

  kafkaConnectName: string;
  KafkaConnectJobJson: string;

  kafkaConnectRequest: IKafkaConnectRequestBody;

  kafkaConnectTasks: string;

  createKafkaTopic(listenerStep: TdStepComponent): void {
    this._loadingService.register('KafkaSetupFormLoader');
    this._kafkaService.createTopic(this.kafkaTopic).subscribe((result: string) => {
      this.kafkaTopicCreateStatus = result;
      this.stateKafkaStep = StepState.Complete;
      this.openNextStep(listenerStep);
      //this.kafkaStep.close();
      //listenerStep.open();
      this._loadingService.resolve('KafkaSetupFormLoader');
    }, (error: any) => {
      this._loadingService.resolve('KafkaSetupFormLoader');
      console.log(error);
      this._errorService.open({body: error.error.Error, code: error.status});
      this.stateKafkaStep = StepState.None;
    });
  }

  login(): void {
    this._loadingService.register('listnerSetupFormLoader');
    this._loginService.login({username: this.username, password: this.password}).subscribe((data: any)=> {
      this._listenerService.getSystems().subscribe(systems => {
        this.systems = systems;
        //console.log(this.systems);
        this._loadingService.resolve('listnerSetupFormLoader');
        this.token = 'y'
      }, (error: any) => {
        //console.log(error);
        this._loadingService.resolve('listnerSetupFormLoader');
        this._errorService.open({body: error.error.body, code: error.status});
        this.stateListenerStep = StepState.None;
      });
    }, (error: any) => {
      this._loadingService.resolve('listnerSetupFormLoader');
      //console.log(error);
      this._errorService.open({body: error.error.body, code: error.status});
      this.stateListenerStep = StepState.None;
    });
    //this._listenerService.getSystems().subscribe(systems => this.systems = systems);
  }

  async openNextStep(nextStep?: TdStepComponent): Promise<void> {
    setTimeout(() => {nextStep.open();}, 0);
    return;
  }

  createListenerJob(kafkaConnectStep: TdStepComponent): void {

    if (!this.sourceId) {
      this.createSource(kafkaConnectStep);
    } else if (!this.targetId) {
      this.createTarget(this.sourceId, kafkaConnectStep);
    } else if (!this.started) {
      this.startTarget(this.targetId, kafkaConnectStep);
    }

  }


  createSource(kafkaConnectStep: TdStepComponent): void {
    this.sourceRequst.subscription_info = { topic: this.kafkaTopic.topic };
    this.sourceRequst.name = this.listenerJobName + ' src';
    this.sourceRequst.description = this.listenerJobDescription + ' (Source)';
    //console.log(this.sourceRequst);
    this._loadingService.register('listnerSetupFormLoader');
    this._listenerService.createSource(this.sourceRequst).subscribe((data: any) => {
      this.sourceId = data.source_id;
      console.log(data);
      this.createTarget(this.sourceId, kafkaConnectStep);
      //this.stateListenerStep = StepState.Complete;
      //this.openNextStep(kafkaConnectStep);
    }, (error: any) => {
      this._loadingService.resolve('listnerSetupFormLoader');
      console.log(error);
      this._errorService.open({body: error.error.body, code: error.status});
      this.stateListenerStep = StepState.None;
    });
  }

  createTarget(source_id: string, kafkaConnectStep: TdStepComponent): void {
    this.targetRequest.source_id = source_id;
    this.targetRequest.system_id = this.system.system_id;
    this.targetRequest.name = this.listenerJobName + ' tgt';
    this.targetRequest.description = this.listenerJobDescription + ' (Target)';
    this.targetRequest.data_path = { schema: this.schemaName, table: this.tableName};
    this.targetRequest.system_info = { host: this.system.system_info.host, username: this.batchname, password: this.batchpassword};
    //console.log(this.targetRequest);
    this._listenerService.createTarget(this.targetRequest).subscribe((data: any) => {
      this.targetId = data.target_id;
      console.log(data);
      //this.startTarget(this.targetId, kafkaConnectStep);
      this.stateListenerStep = StepState.Complete;
      this.openNextStep(kafkaConnectStep);
      this._loadingService.resolve('listnerSetupFormLoader');
    }, (error: any) => {
      this._loadingService.resolve('listnerSetupFormLoader');
      console.log(error);
      this._errorService.open({body: error.error.body, code: error.status});
      this.stateListenerStep = StepState.None;
    });
  }

  startTarget(target_id: string, kafkaConnectStep: TdStepComponent): void {
    this._listenerService.startTarget(this.targetId).subscribe((data: any) => {
      this._loadingService.resolve('listnerSetupFormLoader');
      this.started = true;
      console.log(data);
      this.stateListenerStep = StepState.Complete;
      this.openNextStep(kafkaConnectStep);
    }, (error: any) => {
      this._loadingService.resolve('listnerSetupFormLoader');
      //console.log(error);
      this._errorService.open({body: error.error.body, code: error.status});
      this.stateListenerStep = StepState.None;
    });
  }

  createKafkaConnectJob(): void {
    this.kafkaConnectRequest = {
      name: this.kafkaConnectName,
      config: JSON.parse(this.KafkaConnectJobJson)
    };

    console.log(this.kafkaConnectRequest);
    this.stateKafkaConnectStep = StepState.Complete;
    this.kafkaConnectStep.close();
    //this._loadingService.register('KafkaConnectSetupFormLoader');
    /*this._kafkaConnectService.startConnect(this.kafkaConnectRequest).subscribe((data: any) =>  {
      console.log(data);
      this.kafkaConnectTasks = data.tasks;
      this.stateKafkaConnectStep = StepState.Complete;
      this._loadingService.resolve('KafkaConnectSetupFormLoader');
    }, (error: any) => {
      this._loadingService.resolve('KafkaConnectSetupFormLoader');
      //console.log(error);
      this._errorService.open({body: error.error.body, code: error.status});
      this.stateKafkaConnectStep = StepState.None;
    });*/
  }


  repopulateKafkaStep(): void {
    this.kafkaTopic = {
      topic: undefined,
      num_partitions: 6,
      replication_factor: 3,
    };
  }

  repopulateListenerStep(): void {
    this.listenerJobName = undefined;
    this.listenerJobDescription = undefined;
    this.system = undefined;
    this.batchname = undefined;
    this.batchpassword = undefined;
    this.schemaName = undefined;
    this.tableName = undefined;
  }

  repopulateKafkaConnectStep(): void {
    this.kafkaConnectName = undefined;
    this.KafkaConnectJobJson = undefined;
  }


  locked(): boolean {
    return (this.stateKafkaStep === StepState.Complete);
  }

  constructor(private _kafkaService: KafkaService,
              private _listenerService: ListenerService,
              private _kafkaConnectService: KafkaconnectService,
              private _loginService: LoginService,
              private _loadingService: TdLoadingService,
              private _errorService: ErrorService,
              private _vantageSessionService: VantageSessionService) { }

  ngOnInit() {
    //this._kafkaService.getTopics().subscribe(systems => this.kafkaTopics = systems);
    this.user = this._vantageSessionService.user;
  }

  goBack(): void {
    window.history.back();
  }
}
