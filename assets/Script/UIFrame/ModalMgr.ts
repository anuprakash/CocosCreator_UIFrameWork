
import { SysDefine } from "./config/SysDefine";
import UIModalScript from "./UIModalScript";
import UIBase from "./UIBase";
import { ModalType } from "./Struct";
import { UIWindow } from "./UIForm";

/**
 * 遮罩管理
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class ModalMgr extends cc.Component {
    public static popUpRoot = SysDefine.SYS_UIROOT_NAME + '/' + SysDefine.SYS_POPUP_NODE;
    public static _inst: ModalMgr = null;
    public static get inst() {
        if(this._inst == null) {
            this._inst = new ModalMgr();
            ModalMgr.inst.uiModal = new cc.Node("UIModalNode").addComponent(UIModalScript);
            ModalMgr.inst.uiModal.init();
        }
        return this._inst;
    }
    private uiModal:UIModalScript = null;

    /** 为mask添加颜色 */
    private async showModal(maskType: ModalType) {
        await this.uiModal.showModal(maskType.opacity, maskType.easingTime, maskType.isEasing);
    }

    public checkModalWindow(coms: UIWindow[]) {
        if(this.uiModal.node.parent) {
            this.uiModal.node.removeFromParent();
        }
        for(let i=coms.length-1; i>=0; i--) {
            if(coms[i].modalType.opacity > 0) {
                cc.find(ModalMgr.popUpRoot).addChild(this.uiModal.node, Math.max(coms[i].node.zIndex-1, 0));
                this.uiModal.fid = coms[i].fid;
                this.showModal(coms[i].modalType);
                break;
            }
        }
        if(!this.uiModal.node.parent) {
            this.uiModal.node.opacity = 0;
        }
    }
}