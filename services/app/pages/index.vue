<template>
    <div>
        <Suspense>
            <ClientOnly>
                <div>
                    <Navbar />
                    <Hero />
                    <Community />
                    <Features />
                    <GetStarted />
                    <FAQ />
                    <Footer />
                </div>
            </ClientOnly>
            <template #fallback>
                <div italic op50>
                    <span animate-pulse>Loading...</span>
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import Community from "./landing/Community";
import Features from "./landing/Features";
import GetStarted from "./landing/GetStarted";
import FAQ from "./landing/FAQ";
import Footer from "./landing/Footer";

const color = useColorMode()
color.value === 'dark'
color.preference = 'dark'
</script>
