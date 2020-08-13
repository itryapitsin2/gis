const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');
/**
 * @class Oskari.sample.info.SampleInfoBundleInstance
 */
Oskari.clazz.defineES('Oskari.sample.info.SampleInfoBundleInstance', class SampleInfoBundleInstance extends BasicBundle {
    constructor () {
        super();
        this.__name = 'SampleInfoBundleInstance';
        this.loc = Oskari.getMsg.bind(null, 'sample-info');
    }
    _startImpl (sandbox) {
        this._registerForGuidedTour();
    }
    /**
     * @method setSandbox
     * @param {Oskari.Sandbox} sbx
     */
    setSandbox (sbx) {
        this.sandbox = sbx;
    }
    /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
    getSandbox () {
        return this.sandbox;
    }
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update () {
    }

    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start () {

        const me = this;
        // Should this not come as a param?
        const sandbox = Oskari.getSandbox();
        sandbox.register(me);
        me.setSandbox(sandbox);

        // register plugin for map (drawing for my places)

        const conf = this.conf || {};
        // TODO: is there need for multiple styles? style.default, style.edit?
        if (conf.style) {
            this.drawPlugin.setDefaultStyle(conf.style);
        }

        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        // register drawplugin for map
        mapModule.registerPlugin(this.drawPlugin);
        mapModule.startPlugin(this.drawPlugin);
        this.drawPlugin.draw();
    }
    /**
     * @method init
     * implements Module protocol init method - initializes request handlers
     */
    init () {
        this.drawPlugin = Oskari.clazz.create('Oskari.sample.info.silk-road');
        return null;
    }
    /**
     * @method _registerForGuidedTour
     * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
     */
    _registerForGuidedTour () {
        const sendRegister = () => {
            const requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
            if (requestBuilder && this.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                const delegate = {
                    bundleName: this.getName(),
                    priority: 5,
                    getTitle: () => this.loc('guidedTour.title'),
                    getContent: () => this.loc('guidedTour.message'),
                    getPositionRef: () => jQuery('#login'),
                    positionAlign: 'right'
                };
                this.sandbox.request(this, requestBuilder(delegate));
            }
        };

        const tourInstance = this.sandbox.findRegisteredModuleInstance('GuidedTour');
        if (tourInstance) {
            sendRegister();
        } else {
            Oskari.on('bundle.start', (msg) => {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            });
        }
    }
}, {
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
