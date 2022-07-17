function Component()
{
    // default constructor
}

Component.prototype.createOperationsForArchive = function(archive)
{
    console.log("performing custom extract operation")
    component.addOperation("Extract", archive, "@TargetDir@" + "/" + installer.value("version") + "/");
}
Component.prototype.createOperations = function()
{
    component.createOperations();
    if (systemInfo.productType === "windows") {
        component.addOperation("CreateShortcut", "@TargetDir@/sixpro_app.exe", "@StartMenuDir@/SIX PRO.lnk", "workingDirectory=@TargetDir@/", "iconPath=@TargetDir@/sixpro_logo_icon.ico","iconId=0", "description=SIX PRO");
        component.addOperation("CreateShortcut", "@TargetDir@/sixpro_app.exe", "@DesktopDir@/SIX PRO.lnk", "workingDirectory=@TargetDir@/", "iconPath=@TargetDir@/sixpro_logo_icon.ico","iconId=0", "description=SIX PRO");
    }
};
