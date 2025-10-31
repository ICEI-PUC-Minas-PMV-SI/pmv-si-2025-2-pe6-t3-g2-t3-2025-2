'use client';

import Link from 'next/link';
import Image from 'next/image';
import heroImg from '../assets/heroImg.jpg';
import featureImg from '../assets/featureImg.jpg';
import featureImg2 from '../assets/featureImg2.jpg';
import { Icon } from '@iconify/react';

import './styles.css';
import { Navbar } from '../components/navbar/navbar';
import { ScheduleButton } from '../components/schedule-button/schedule-button';

export default function HomePage() {
  return (
    <div className="home">
      {/* Header */}
      <header className="home__header">
        <Navbar />
      </header>

      <main>
        {/* Hero */}
        <section className="home__hero">
          <div className="home__container home__hero-inner">
            <div className="home__hero-cta">
              <div>
                <h3>Centralize o cuidado, simplifique o agendamento</h3>
                <p>Uma plataforma moderna para conectar pacientes e profissionais da saúde.</p>
              </div>
              <Link href="/paciente/consultas/nova">
                <ScheduleButton />
              </Link>
            </div>
            <div className="home__hero-media">
              <Image
                className="home__media-img"
                src={heroImg}
                alt="Imagem de uma profissional de saúde"
                priority
                sizes="(max-width: 1023px) 100vw, 60vw"
              />
            </div>
          </div>
        </section>

        {/* Destaque MedLink */}
        <section className="home__feature" id="sobre">
          <div className="home__container">
            <div className="home__feature-grid">
              <div className="home__feature-image">
                <Image
                  className="home__image-box"
                  src={featureImg}
                  alt="Profissionais de saúde dando as mãos"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>
              <div className="home__feature-text">
                <h2 className="home__section-title">MedLink</h2>
                <h3>Tecnologia e eficiência a serviço da saúde</h3>
                <p>
                  Nosso sistema foi desenvolvido com o objetivo de tornar o processo de agendamento de consultas mais ágil, prático e confiável para clínicas que atendem diversas especialidades. Acreditamos que a tecnologia pode simplificar rotinas, melhorar a comunicação entre pacientes, profissionais de saúde e equipe administrativa, além de reduzir falhas operacionais. Com uma plataforma intuitiva, responsiva e segura, buscamos proporcionar uma experiência fluida e acessível para todos os usuários. Dessa forma, contribuímos para uma gestão mais organizada, um atendimento mais eficiente e, principalmente, para o bem-estar dos pacientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section className="home__specialties" id="especialidades">
          <div className="home__container">
            <h2 className="home__section-title home__section-title--center">
              Escolha entre algumas das diferentes especialidades médicas oferecidas
            </h2>

            <div className="home__cards">
              <article className="home__card">
                <div className="home__card-icon" aria-hidden="true">❤</div>
                <h3 className="home__card-title">Cardiologia</h3>
                <p className="home__card-desc">
                  Saúde cardíaca e gestão de doenças cardiovasculares.
                </p>
              </article>

              <article className="home__card">
                <div className="home__card-icon" aria-hidden="true">🧒</div>
                <h3 className="home__card-title">Pediatria</h3>
                <p className="home__card-desc">
                  Atendimento especializado para bebês, crianças e adolescentes.
                </p>
              </article>

              <article className="home__card">
                <div className="home__card-icon" aria-hidden="true">🩺</div>
                <h3 className="home__card-title">Oftalmologia</h3>
                <p className="home__card-desc">
                  Cuidamos da saúde ocular para um olhar mais nítido e saudável.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Bloco de conteúdo + CTA */}
        <section className="home__info-cta" id="profissionais">
          <div className="home__container home__info-cta-grid">
            <div className="home__info-image">
              <Image
                className="home__image-box home__image-box--lg"
                src={featureImg2}
                alt="Médicos formando um círculo"
                sizes="(max-width: 1023px) 100vw, 60vw"
              />
            </div>
            <div className="home__info-cta-btn">
              <h2>
                Conheça nossa Equipe de Especialistas: Dedicação e Expertise Cuidando da sua saúde com o mais alto padrão de excelência.
              </h2>
              <div>
                <Link href="/paciente/consultas/nova">
                  <ScheduleButton />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home__footer">
        <div className="home__container home__footer-grid">
          <section className="home__footer-brand">
            <h2 className="sr-only">Rodapé</h2>
            <div className="home__footer-logo">MedLink</div>
            <p className="home__footer-desc">
              Sua fonte confiável para serviços de saúde especializados e de excelência.
              Oferecemos cuidado compassivo e atendimento totalmente personalizado,
              priorizando o bem-estar de você e toda sua família.
            </p>
            <div className="home__social">
              <Link href="#" aria-label="Instagram" className="home__social-btn">
                <Icon icon="simple-icons:instagram" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="Facebook" className="home__social-btn">
                <Icon icon="simple-icons:facebook" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="WhatsApp" className="home__social-btn">
                <Icon icon="simple-icons:whatsapp" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="TikTok" className="home__social-btn">
                <Icon icon="simple-icons:tiktok" width="20" height="20" />
              </Link>
            </div>
            <div className="home__cnpj">CNPJ: 09.999.999/0001-00</div>
          </section>

          <nav className="home__footer-nav" aria-label="Navegação no rodapé">
            <h3>Navegação</h3>
            <ul>
              <li><Link href="#sobre">Sobre</Link></li>
              <li><Link href="#especialidades">Especialidades</Link></li>
              <li><Link href="#profissionais">Profissionais</Link></li>
              <li><Link href="/login">Entrar</Link></li>
            </ul>
          </nav>

          <section className="home__footer-contact">
            <h3>Contatos</h3>
            <ul>
              <li>(11) 9 9999-8888</li>
              <li>suporte@medlink.com</li>
              <li>Av. Agamenon Magalhães, 1000<br />Centro - São Paulo-SP</li>
            </ul>
          </section>
        </div>

        <div className="home__footer-legal">
          <div className="home__container home__footer-legal-inner">
            <Link href="/" className="home__legal-link">Termos de serviço</Link>
            <Link href="/" className="home__legal-link">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}