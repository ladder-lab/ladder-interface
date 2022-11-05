import TwitterLogo1 from 'assets/images/twitter-colorful.png'
import DiscordLogo1 from 'assets/images/discord-colorful.png'
import MediumLogo1 from 'assets/images/medium-colorful.png'
import TelegramLogo1 from 'assets/images/telegram-colorful.png'

export const SocialLinks = {
  TWITTER: 'https://twitter.com/Laddertop_NFT',
  DISCORD: 'https://discord.gg/FjXpN8wYBq',
  MEDIUM: 'https://medium.com/@ladder_top',
  TELEGRAM: 'https://t.me/+CQuxqoqD7GIxZTY1'
}

export const DocLink = '/'

export const Socials: {
  [key: string]: {
    title: string
    logo1: string
    link: string
  }
} = {
  TWITTER: {
    title: 'twitter',
    logo1: TwitterLogo1,

    link: SocialLinks.TWITTER
  },
  DISCORD: {
    title: 'discord',
    logo1: DiscordLogo1,

    link: SocialLinks.DISCORD
  },
  MEDIUM: {
    title: 'medium',
    logo1: MediumLogo1,

    link: SocialLinks.MEDIUM
  },
  TELEGRAM: {
    title: 'telegram',
    logo1: TelegramLogo1,

    link: SocialLinks.TELEGRAM
  }
}
