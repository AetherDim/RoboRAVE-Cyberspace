import { PortToSensorMap } from "./PortToSensorMap"

export interface RobotConfiguration {
    TRACKWIDTH: number
    WHEELDIAMETER: number
    // TODO: Implement
    // ACTUATORS: PortToSensorMap // type PortToSensorMap = StringMap<RobertaMotorConfiguration>
    SENSORS: PortToSensorMap
}