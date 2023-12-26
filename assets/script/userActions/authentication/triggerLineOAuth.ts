import { _decorator } from 'cc';
import { BaseComponent } from '../../core/components/BaseComponent';
import { OAuthCompany } from '../../core/enum/OAuthCompany';
import { NativeEvent } from '../../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('triggerLineOAuth')
export class triggerLineOAuth extends BaseComponent {
    fire() {
        this.event.emit(NativeEvent.JSB_TRIGGER_OAUTH, OAuthCompany.LINE);
    }
}

