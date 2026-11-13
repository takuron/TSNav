// Simple Icons SVG 在构建时内联，避免运行时请求 CDN；文件中的 fill 保留官方品牌色。
import adobe from './simpleicon/adobe.svg?raw';
import amazon from './simpleicon/amazon.svg?raw';
import angular from './simpleicon/angular.svg?raw';
import apple from './simpleicon/apple.svg?raw';
import asana from './simpleicon/asana.svg?raw';
import behance from './simpleicon/behance.svg?raw';
import bilibili from './simpleicon/bilibili.svg?raw';
import bitbucket from './simpleicon/bitbucket.svg?raw';
import box from './simpleicon/box.svg?raw';
import canva from './simpleicon/canva.svg?raw';
import codepen from './simpleicon/codepen.svg?raw';
import coursera from './simpleicon/coursera.svg?raw';
import deepseek from './simpleicon/deepseek.svg?raw';
import discord from './simpleicon/discord.svg?raw';
import docker from './simpleicon/docker.svg?raw';
import dribbble from './simpleicon/dribbble.svg?raw';
import dropbox from './simpleicon/dropbox.svg?raw';
import epicgames from './simpleicon/epicgames.svg?raw';
import facebook from './simpleicon/facebook.svg?raw';
import freecodecamp from './simpleicon/freecodecamp.svg?raw';
import github from './simpleicon/github.svg?raw';
import gitlab from './simpleicon/gitlab.svg?raw';
import instagram from './simpleicon/instagram.svg?raw';
import javascript from './simpleicon/javascript.svg?raw';
import kubernetes from './simpleicon/kubernetes.svg?raw';
import linkedin from './simpleicon/linkedin.svg?raw';
import medium from './simpleicon/medium.svg?raw';
import microsoft from './simpleicon/microsoft.svg?raw';
import microsoftedge from './simpleicon/microsoftedge.svg?raw';
import microsoftoffice from './simpleicon/microsoftoffice.svg?raw';
import neteasecloudmusic from './simpleicon/neteasecloudmusic.svg?raw';
import netflix from './simpleicon/netflix.svg?raw';
import nextdotjs from './simpleicon/nextdotjs.svg?raw';
import notion from './simpleicon/notion.svg?raw';
import npm from './simpleicon/npm.svg?raw';
import nuxt from './simpleicon/nuxt.svg?raw';
import paypal from './simpleicon/paypal.svg?raw';
import pinterest from './simpleicon/pinterest.svg?raw';
import python from './simpleicon/python.svg?raw';
import qq from './simpleicon/qq.svg?raw';
import react from './simpleicon/react.svg?raw';
import reddit from './simpleicon/reddit.svg?raw';
import rust from './simpleicon/rust.svg?raw';
import shopify from './simpleicon/shopify.svg?raw';
import sinaweibo from './simpleicon/sinaweibo.svg?raw';
import slack from './simpleicon/slack.svg?raw';
import spotify from './simpleicon/spotify.svg?raw';
import steam from './simpleicon/steam.svg?raw';
import stripe from './simpleicon/stripe.svg?raw';
import telegram from './simpleicon/telegram.svg?raw';
import tiktok from './simpleicon/tiktok.svg?raw';
import trello from './simpleicon/trello.svg?raw';
import twitch from './simpleicon/twitch.svg?raw';
import twitter from './simpleicon/twitter.svg?raw';
import typescript from './simpleicon/typescript.svg?raw';
import udemy from './simpleicon/udemy.svg?raw';
import vue from './simpleicon/vue.svg?raw';
import whatsapp from './simpleicon/whatsapp.svg?raw';
import wordpress from './simpleicon/wordpress.svg?raw';
import x from './simpleicon/x.svg?raw';
import zhihu from './simpleicon/zhihu.svg?raw';

/** 构建时内联的常见 Simple Icons；不依赖 npm 图标注册表。 */
export const simpleIconCache: Record<string, string> = Object.fromEntries(
  Object.entries({
    adobe,
    amazon,
    angular,
    apple,
    asana,
    behance,
    bilibili,
    bitbucket,
    box,
    canva,
    codepen,
    coursera,
    deepseek,
    discord,
    docker,
    dribbble,
    dropbox,
    epicgames,
    facebook,
    freecodecamp,
    github,
    gitlab,
    instagram,
    javascript,
    kubernetes,
    linkedin,
    medium,
    microsoft,
    microsoftedge,
    microsoftoffice,
    neteasecloudmusic,
    netflix,
    nextdotjs,
    notion,
    npm,
    nuxt,
    paypal,
    pinterest,
    python,
    qq,
    react,
    reddit,
    rust,
    shopify,
    sinaweibo,
    slack,
    spotify,
    steam,
    stripe,
    telegram,
    tiktok,
    trello,
    twitch,
    twitter,
    typescript,
    udemy,
    vue,
    whatsapp,
    wordpress,
    x,
    zhihu,
  })
    .map(([id, svg]) => [id, `data:image/svg+xml,${encodeURIComponent(svg)}`])
);
