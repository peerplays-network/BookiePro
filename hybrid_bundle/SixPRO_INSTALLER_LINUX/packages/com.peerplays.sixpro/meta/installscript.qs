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
        component.addOperation("CreateShortcut", "@TargetDir@/DistributionKit/sixpro_app_target", "@StartMenuDir@/sixpro_app.lnk", "workingDirectory=@TargetDir@", "iconPath=@TargetDir@/DistributionKit/sixpro_app_target","iconId=0", "description=sixpro_app Executable");
        component.addOperation("CreateShortcut", "@TargetDir@/DistributionKit/sixpro_app_target", "@DesktopDir@/sixpro_app.lnk", "workingDirectory=@TargetDir@", "iconPath=@TargetDir@/DistributionKit/sixpro_app_target","iconId=0", "description=sixpro_app Executable");
    }
};
