<template>
    <div>
        <Suspense>
            <ClientOnly>
                <div>
                    <Navbar />
                    <Background />
                    <Hero />
                    <Community />
                    <Features />
                    <GetStarted />
                    <Partnerships />
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
import Navbar from './landing/Navbar'
import Hero from './landing/Hero'
import Community from './landing/Community'
import Features from './landing/Features'
import GetStarted from './landing/GetStarted'
import FAQ from './landing/FAQ'
import Footer from './landing/Footer'
import Background from './landing/Background.vue'
import Partnerships from './landing/Partnerships.vue'

const color = useColorMode()
color.value === 'dark'
color.preference = 'dark'
</script>
