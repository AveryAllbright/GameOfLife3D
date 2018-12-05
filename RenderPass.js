THREE.RenderPass = function(scene, camera, override, colour, alpha)
{
    THREE.pass.call(this);
    this.scene = scene;
    this.camera = camera;
    
    this.overrideMaterial = override;
    
    this.clearColour = colour; 
    this.clearAlpha = alpha;
    
};

THREE.RenderPass.prototype = Object.assign(Object.create(THREE.pass.prototype),
                                          {
    constructor : THREE.RenderPass,
    
    render : function(renderer, writeBuffer, readBuffer, delta, maskActive )
    {
        let oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;
        
        this.scene.overrideMaterial = this.overrideMaterial;
        
        let oldClearColor , oldClearAlpha;
        
        if(this.clearColour)
            {
                oldClearColor = renderer.getClearColour().getHex();
                oldClearAlpha = renderer.getClearAlpha();
                
                renderer.setClearColor (this.clearColour, this.clearAlpha);
            }
        
        renderer.render (this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);
        
        if(this.clearColor)
            {
                renderer.setClearColor (oldClearColor, oldClearAlpha);
            }
        
        this.scene.overrideMaterial = null;
        renderer.autoClear = oldAutoClear;        
    }
});