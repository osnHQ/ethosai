<template>
    <div class="blur-effect"></div>
                    <div class="blur-effect ml-200 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blur-effect ml-300 mt-80 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blur-effect ml-160 mt-160 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blur-effect ml-160 mt-160 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blur-effect ml--20 mt-270"></div>
                    <div class="blur-effect ml-315 mt-370 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blur-effect ml--20 mt-470"></div>
                    <div class="blur-effect ml-315 mt-620 md-hidden lg-block max-sm:hidden"></div>
                    <!-- <div class="blur-effect ml--20 mt-770"></div>
                    <div class="blur-effect ml-315 mt-890 md-hidden lg-block max-sm:hidden"></div> -->
                    <div class="red-blur-effect ml-160 mt-235 md-hidden lg-block max-sm:hidden"></div>
                    <div class="blurred-gradient ml-160 mt-335 md-hidden lg-block max-sm:hidden"></div>
                    <div class="purple-circle ml-130 mt-360 md-hidden lg-block max-sm:hidden"></div>
                    <!-- <div class="blurred-gradient ml-160 mt-1135 md-hidden lg-block max-sm:hidden"></div>
                    <div class="purple-circle ml-130 mt-1135 md-hidden lg-block max-sm:hidden"></div> -->
                    <img src="public/Stars.png" class="absolute w-200 left-80 md-hidden lg-block max-sm:hidden -z-1" alt="">
                    <img src="public/Stars.png" class="absolute w-350 top-150 md-hidden lg-block max-sm:hidden -z-1" alt="">
                    <img src="public/Stars.png" class="absolute w-350 top-460 md-hidden lg-block max-sm:hidden -z-1" alt="">
</template>

<style>
.blur-effect {
  width: 200px;
  height: 200px;
  background-color: #000080; 
  box-shadow: 
    0 0 60px 20px rgba(15, 43, 99, 0.4),
    0 0 100px 40px rgba(15, 43, 99, 0.3),
    0 0 140px 60px rgba(24, 69, 163, 0.2),
    0 0 180px 80px rgba(24, 69, 163, 0.1),
    0 0 220px 100px rgba(24, 69, 163, 0.05);
    filter: blur(100px);
    position: absolute;
    z-index: -1;
}

.red-blur-effect{
    width: 240px;
  height: 80px; 
  background-color: #5D1A23; 
  border-radius: 10%; 
  box-shadow: 
    0 0 10px 10px rgba(165, 17, 33, 0.9),
    0 0 30px 30px rgba(150, 10, 28, 0.8),
    0 0 50px 50px rgba(120, 0, 20, 0.7),
    0 0 70px 70px rgba(80, 0, 14, 0.6),
    0 0 90px 90px rgba(50, 0, 10, 0.5),
    0 0 110px 110px rgba(30, 0, 6, 0.4);
    filter: blur(200px);
    position: absolute;
    z-index: -1;
}

.blurred-gradient {
  width: 200px; 
  height: 200px; 
  background: linear-gradient(135deg, #6D31BA 0%, #FF5370 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 60px 10px rgba(109, 49, 186, 0.6),
    0 0 100px 30px rgba(255, 83, 112, 0.5),
    0 0 140px 50px rgba(109, 49, 186, 0.4),
    0 0 180px 70px rgba(255, 83, 112, 0.3),
    0 0 220px 90px rgba(109, 49, 186, 0.2),
    0 0 260px 110px rgba(255, 83, 112, 0.1);
    position: absolute;
    z-index: -1;
    filter: blur(100px);
}

.purple-circle {
  width: 200px;
  height: 200px;
  background-color: rgb(119, 0, 255);
  border-radius: 50%;
  position: absolute;
    z-index: -1;
    filter: blur(100px);
}
</style>
