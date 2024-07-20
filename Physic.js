import "./style.css";
import * as dat from "dat.gui";
import Vector3 from "./Library";
import Diriction from "./Directions";
import GMath from "./GMath";
import { Vec3 } from "cannon";

class Boat {
  constructor() {
    this.position = new Vector3(); // Position vector
    this.velocity = new Vector3(); // Velocity vector
    this.accel = new Vector3(); // Acceleration vector
    this.gravity = 9.81;
    this.mass = 500;
    this.water_density = 1025;
    this.c_d = 0.3;
    // this.a = 1.675;
    // this.air_density = 1.2;
    // this.wind_velocity;
    // this.s = 3000;
    // this.t = 75;
  }

  ////////////////////////UPDATE/////////////////

  update() {
    let gravityForce = this.calGravity(this.mass);
    let buoyantForce = this.calBuoyant(this.mass);

    // TOTAL FORCE
    var totalF = this.totalForce();

    // LINEAR ACCELERATION
    this.accel = totalF.divideScalar(this.mass);

    // LINEAR VELOCITY
    this.velocity = this.velocity.addVector(
      this.accel.clone().multiplyScalar(0.02)
    );

    this.vlenght = this.velocity.length();

    this.position = this.position.addVector(
      this.velocity.clone().multiplyScalar(0.02)
    );
  }

 cal_delta(old_x,new_x){
    let deltaX = new_x - old_x;
    return deltaX;
 }
  cal_Gravity(mass) {
    var weight = this.gravity * this.mass;
    var gravity_Vector = new Vector3(0, -1 * weight, 0);
    return gravity_Vector;
  }
  cal_Float(){
    var water_volume =this.mass/this.water_density;
     var float_power = this.water_density*this.gravity*water_volume; 
     return float_power;
  }
  cal_

  cal_pressure(){
     

  }
  cal_wind_force(){
    var p = cal_delta(5,8);
    var d =
  }


   /////////////////////////////TOTAL FORCE///////////////////////////////////////
  totalForce() {
    var tf = new Vector3();
    tf = tf.addVector(this.calGravity());
    tf = tf.addVector(this.calBuoyant());
    tf = tf.addVector(this.calDrag());
    tf = tf.addVector(this.calAirResistance());
    tf = tf.addVector(this.calThrust());
    // Add other forces here like buoyant force if needed
    return tf;
  }


  calBuoyant(mass, water_density) {
    // Implement buoyant force calculation if needed
    var volume_water = this.mass / this.water_density;
    var F_Buoyant = this.gravity * this.water_density * volume_water;
    var BuoyantVector = new Vector3(0, F_Buoyant, 0);
    return BuoyantVector;
  }
  calDrag() {
    var F_darg =
      (1 / 2) * this.water_density * this.c_d * this.a * this.velocity.length();
    var dargVector = new Vector3(-F_darg, 0, 0);
    return dargVector;
  }
  calAirResistance() {
    var F_airresistance =
      (1 / 2) * this.air_density * this.c_d * this.a * this.velocity.length();
    var airresistanceVector = new Vector3(-1 * F_airresistance, 0, 0);
    return airresistanceVector;
  }
  calThrust() {
    var F_thrust = (2 * 3.14 * this.s * this.t) / 60;
    var thrustVector = new Vector3(F_thrust, 0, 0);
    return thrustVector;
  }
//   calWeight(){
//     var weight= this.gravity* this.mass;
//     return weight; 
//   }

}

export default Boat;
