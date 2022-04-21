<template>
  <div>
    <div class="container-fluid">
      <div class="">
        <div
          id=""
          class="container-fluid"
          style="position: relative; width: 848px; height: 598px; z-index: 0"
        >
          <img
            src="../assets/reaktor.png"
            id=""
            class="img-fluid mt-4 rounded"
            alt=""
            focusable="false"
          />

          <!-- Temperature -->
          <div class="vl"></div>
          <span class="centered-noborder temptext text-center"
            >Temperature</span
          >
          <Transition>
            <h4 class="centered text-body temp text-center">
              {{ reaktorData.temp }} °C
            </h4>
          </Transition>

          <!-- Pressure -->
          <div class="v2">
            <p class="centered-noborder presstext text-center">Pressure</p>
            <h4 class="centered text-body press text-center">
              {{ reaktorData.press }} Bar
            </h4>
          </div>

          <!-- Indicators
        <img
          v-bind:class="
            ccwr ? 'ccwr indicator bg-success' : 'ccwr indicator bg-danger'
          "
        />
        <img
          v-bind:class="
            cwr ? 'cwr indicator bg-success' : 'cwr indicator bg-danger'
          "
        />
        <img
          v-bind:class="
            drain ? 'drain indicator bg-success' : 'drain indicator bg-danger'
          "
        />
        <img
          v-bind:class="
            drain2
              ? 'drain2 indicator bg-success'
              : 'drain2 indicator bg-danger'
          "
        /> -->

          <!-- Buttons -->
          <div v-if="reaktorData.status">
            <!-- CCWR -->
            <button
              v-bind:class="
                reaktorData.port.valve1
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; left: 80px; top: 15px; z-index: 4"
              disabled
            >
              {{ reaktorData.port.valve1 ? "Open" : "Close" }}
            </button>

            <!-- CW-R -->
            <button
              v-bind:class="
                reaktorData.port.cwr
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; left: 80px; top: 120px; z-index: 1"
              disabled
            >
              {{ reaktorData.port.cwr ? "Open" : "Close" }}
            </button>

            <!-- STEAM -->
            <button
              v-bind:class="
                reaktorData.port.steam
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; left: 125px; top: 220px; z-index: 1"
              disabled
            >
              {{ reaktorData.port.steam ? "Open" : "Close" }}
            </button>

            <!-- STEAM LED -->
            <button
              v-bind:class="
                reaktorData.port.steamLed
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; left: 208px; top: 230px; z-index: 1"
              disabled
            >
              {{ reaktorData.port.steamLed ? "On" : "Off" }}
            </button>

            <!-- CW -->
            <button
              v-bind:class="
                reaktorData.port.cw ? 'btn-success btn-sm' : 'btn-danger btn-sm'
              "
              style="
                position: absolute;
                right: 250px;
                bottom: 225px;
                z-index: 3;
              "
              disabled
            >
              {{ reaktorData.port.cw ? "Open" : "Close" }}
            </button>

            <!-- CW LED -->
            <button
              v-bind:class="
                reaktorData.port.cwLed
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="
                position: absolute;
                right: 180px;
                bottom: 170px;
                z-index: 3;
              "
              disabled
            >
              {{ reaktorData.port.cwLed ? "On" : "Off" }}
            </button>

            <!-- CCW -->
            <button
              v-bind:class="
                reaktorData.port.ccw
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="
                position: absolute;
                right: 137px;
                bottom: 260px;
                z-index: 3;
              "
              disabled
            >
              {{ reaktorData.port.ccw ? "Open" : "Close" }}
            </button>

            <!-- CcW LED -->
            <button
              v-bind:class="
                reaktorData.port.ccwLed
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; right: 80px; bottom: 170px; z-index: 3"
              disabled
            >
              {{ reaktorData.port.ccwLed ? "On" : "Off" }}
            </button>

            <!-- DRAIN 1 -->
            <button
              v-bind:class="
                reaktorData.port.drainTop
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="
                position: absolute;
                right: 115px;
                bottom: 105px;
                z-index: 3;
              "
              disabled
            >
              {{ reaktorData.port.drainTop ? "Open" : "Close" }}
            </button>

            <!-- DRAIN 2 -->
            <button
              v-bind:class="
                reaktorData.port.drainBottom
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; right: 160px; bottom: 0px; z-index: 2"
              disabled
            >
              {{ reaktorData.port.drainBottom ? "Open" : "Close" }}
            </button>

            <button
              v-bind:class="
                reaktorData.port.drainLed
                  ? 'btn-success btn-sm'
                  : 'btn-danger btn-sm'
              "
              style="position: absolute; right: 73px; bottom: 50px; z-index: 3"
              disabled
            >
              {{ reaktorData.port.drainLed ? "On" : "Off" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

var socket = io("http://localhost:3000");

export default {
  name: "HelloWorld",
  data() {
    return {
      // ccwr: true,
      // cwr: true,
      // steam: false,
      // steamIndicator: false,
      // cw: false,
      // cwIndicator: false,
      // ccw: false,
      // ccwIndicator: false,
      // drain: true,
      // drain2: true,
      // drainIndicator: false,
      // steamIndicator: true,
    };
  },

  methods: {},

  beforeMount() {
    this.$store.dispatch("data");
  },

  mounted() {},

  computed: {
    reaktorData() {
      return this.$store.getters.reaktor;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.centered {
  position: absolute;
  top: 24%;
  left: 42%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
}
.centered-noborder {
  position: absolute;
  top: 24%;
  left: 42%;
  transform: translate(-50%, -50%);
}

.vl {
  border-left: 2px solid black;
  height: 150px;
  position: absolute;
  left: 42%;
  margin-left: -3px;
  bottom: 54%;
}
.temp {
  position: absolute;
  top: 105px;
  width: 100px;
}
.temptext {
  position: absolute;
  top: 70px;
  width: 100px;
}

.press {
  position: absolute;
  top: -20px;
  width: 100px;
}
.presstext {
  position: absolute;
  top: -50px;
  width: 100px;
}
.v2 {
  border-left: 2px solid black;
  height: 200px;
  position: absolute;
  right: 44%;
  margin-right: -3px;
  top: 75px;
}
.indicator {
  width: 15px;
  height: 15px;
  border-radius: 100px;
}
.ccwr {
  position: absolute;
  left: 120px;
  top: 30px;
  z-index: 4;
}
.cwr {
  position: absolute;
  left: 120px;
  top: 135px;
  z-index: 1;
}
.drain {
  position: absolute;
  right: 200px;
  bottom: 85px;
  z-index: 3;
}
.drain2 {
  position: absolute;
  right: 200px;
  bottom: 30px;
  z-index: 2;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
