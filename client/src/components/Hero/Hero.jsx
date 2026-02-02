import './Hero.css'
import heroImage from '../../assets/img/hero-sin-fondo.png'

const Hero = () => {
  return (
    <section className="hero">
      <img src={heroImage} alt="Hero Memorice" />
    </section>
  )
}

export default Hero
