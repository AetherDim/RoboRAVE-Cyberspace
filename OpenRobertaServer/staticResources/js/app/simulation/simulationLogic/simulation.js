define(["require", "exports", "./renderer", "./Geometry/Ray", "matter-js", "./Geometry/LineSegment", "./extendedMatter"], function (require, exports, renderer_1, Ray_1, matter_js_1, LineSegment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cancel = exports.interpreterAddEvent = exports.endDebugging = exports.updateDebugMode = exports.resetPose = exports.setInfo = exports.importImage = exports.stopProgram = exports.run = exports.setPause = exports.getNumRobots = exports.init = void 0;
    var engine = new renderer_1.SceneRender('sceneCanvas', 'simDiv');
    engine.getScene().setupDebugRenderer('notConstantValue');
    //engine.getScene().setupDebugRenderer('simDiv');
    engine.getScene().testPhysics();
    new Ray_1.Ray(matter_js_1.Vector.create(-3, 4), matter_js_1.Vector.create(1, 0)).intersectionPoint(new LineSegment_1.LineSegment(matter_js_1.Vector.create(0, 0), matter_js_1.Vector.create(0, 10)));
    /**
     * @param programs
     * @param refresh `true` if "SIM" is pressed, `false` if play is pressed
     * @param robotType
     */
    function init(programs, refresh, robotType) {
        $('#blockly').openRightView("sim", 0.5);
        console.log("init");
        engine.setPrograms(programs);
        engine.startSim();
    }
    exports.init = init;
    function getNumRobots() {
        return 1;
    }
    exports.getNumRobots = getNumRobots;
    function setPause(pause) {
    }
    exports.setPause = setPause;
    function run(p1, p2) {
        engine.startSim();
    }
    exports.run = run;
    function stopProgram() {
        engine.stopSim();
    }
    exports.stopProgram = stopProgram;
    function importImage() {
    }
    exports.importImage = importImage;
    function setInfo() {
    }
    exports.setInfo = setInfo;
    function resetPose() {
    }
    exports.resetPose = resetPose;
    function updateDebugMode(p1) {
    }
    exports.updateDebugMode = updateDebugMode;
    function endDebugging() {
    }
    exports.endDebugging = endDebugging;
    function interpreterAddEvent(event) {
    }
    exports.interpreterAddEvent = interpreterAddEvent;
    function cancel() {
    }
    exports.cancel = cancel;
});
