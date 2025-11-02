'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

import { Navbar } from '@/app/components/navbar/navbar';
import { ScheduleButton } from '../components/schedule-button/schedule-button';
import heroImg from '../assets/heroImg.jpg';
import featureImg from '../assets/featureImg.jpg';
import featureImg2 from '../assets/featureImg2.jpg';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* Header */}
      <header className={styles.home__header}>
        <Navbar />
      </header>

      <main>
        {/* Hero */}
        <section className={styles.home__hero}>
          <div className={styles.home__container + ' ' + styles.home__hero_inner}>
            <div className={styles.home__hero_cta}>
              <div>
                <h3 className={styles.hero_title}>
                  Centralize o cuidado, simplifique o agendamento
                </h3>
                <p className={styles.hero_sub}>
                  Uma plataforma moderna para conectar pacientes e profissionais da saúde.
                </p>
              </div>

              <Link href="/paciente/consultas/nova" className={styles.linkReset}>
                <ScheduleButton />
              </Link>
            </div>

            <div className={styles.home__hero_media}>
              <Image
                className={styles.home__media_img}
                src={heroImg}
                alt="Imagem de uma profissional de saúde"
                priority
                sizes="(max-width: 1023px) 100vw, 60vw"
              />
            </div>
          </div>
        </section>

        {/* Destaque MedLink */}
        <section className={styles.home__feature} id="sobre">
          <div className={styles.home__container}>
            <div className={styles.home__feature_grid}>
              <div className={styles.home__feature_image}>
                <Image
                  className={styles.home__image_box}
                  src={featureImg}
                  alt="Profissionais de saúde dando as mãos"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>

              <div className={styles.home__feature_text}>
                <h2 className={styles.home__section_title}>MedLink</h2>
                <h3>Tecnologia e eficiência a serviço da saúde</h3>
                <p className={styles.feature_paragraph}>
                  Nosso sistema foi desenvolvido com o objetivo de tornar o processo de
                  agendamento de consultas mais ágil, prático e confiável para clínicas que
                  atendem diversas especialidades. Acreditamos que a tecnologia pode
                  simplificar rotinas, melhorar a comunicação entre pacientes, profissionais de
                  saúde e equipe administrativa, além de reduzir falhas operacionais. Com uma
                  plataforma intuitiva, responsiva e segura, buscamos proporcionar uma
                  experiência fluida e acessível para todos os usuários. Dessa forma,
                  contribuímos para uma gestão mais organizada, um atendimento mais eficiente
                  e, principalmente, para o bem-estar dos pacientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section className={styles.home__specialties} id="especialidades">
          <div className={styles.home__container}>
            <h2 className={`${styles.home__section_title} ${styles['home__section-title--center']}`}>
              Escolha entre algumas das diferentes especialidades médicas oferecidas
            </h2>

            <div className={styles.home__cards}>
              <article className={styles.home__card}>
                <div className={styles.home__card_icon} aria-hidden="true">
                  ❤
                </div>
                <h3 className={styles.home__card_title}>Cardiologia</h3>
                <p className={styles.home__card_desc}>
                  Saúde cardíaca e gestão de doenças cardiovasculares.
                </p>
              </article>

              <article className={styles.home__card}>
                <div className={styles.home__card_icon} aria-hidden="true">
                  🧒
                </div>
                <h3 className={styles.home__card_title}>Pediatria</h3>
                <p className={styles.home__card_desc}>
                  Atendimento especializado para bebês, crianças e adolescentes.
                </p>
              </article>

              <article className={styles.home__card}>
                <div className={styles.home__card_icon} aria-hidden="true">
                  🩺
                </div>
                <h3 className={styles.home__card_title}>Oftalmologia</h3>
                <p className={styles.home__card_desc}>
                  Cuidamos da saúde ocular para um olhar mais nítido e saudável.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Bloco de conteúdo + CTA */}
        <section className={styles.home__info_cta} id="profissionais">
          <div className={`${styles.home__container} ${styles.home__info_cta_grid}`}>
            <div className={styles.home__info_image}>
              <Image
                className={`${styles.home__image_box} ${styles.home__image_box_lg}`}
                src={featureImg2}
                alt="Médicos formando um círculo"
                sizes="(max-width: 1023px) 100vw, 60vw"
              />
            </div>
            <div className={styles.home__info_cta_btn}>
              <h2>
                Conheça nossa Equipe de Especialistas: Dedicação e Expertise Cuidando da sua saúde
                com o mais alto padrão de excelência.
              </h2>
              <div>
                <Link href="/paciente/consultas/nova" className={styles.linkReset}>
                  <ScheduleButton />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.home__footer}>
        <div className={`${styles.home__container} ${styles.home__footer_grid}`}>
          <section className={styles.home__footer_brand}>
            <h2 className="sr-only">Rodapé</h2>
            <div className={styles.home__footer_logo}>MedLink</div>
            <p className={styles.home__footer_desc}>
              Sua fonte confiável para serviços de saúde especializados e de excelência.
              Oferecemos cuidado compassivo e atendimento totalmente personalizado,
              priorizando o bem-estar de você e toda sua família.
            </p>

            <div className={styles.home__social}>
              <Link href="#" aria-label="Instagram" className={styles.home__social_btn}>
                <Icon icon="simple-icons:instagram" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="Facebook" className={styles.home__social_btn}>
                <Icon icon="simple-icons:facebook" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="WhatsApp" className={styles.home__social_btn}>
                <Icon icon="simple-icons:whatsapp" width="20" height="20" />
              </Link>
              <Link href="#" aria-label="TikTok" className={styles.home__social_btn}>
                <Icon icon="simple-icons:tiktok" width="20" height="20" />
              </Link>
            </div>

            <div className={styles.home__cnpj}>CNPJ: 09.999.999/0001-00</div>
          </section>

          <nav className={styles.home__footer_nav} aria-label="Navegação no rodapé">
            <h3>Navegação</h3>
            <ul>
              <li>
                <Link href="#sobre">Sobre</Link>
              </li>
              <li>
                <Link href="#especialidades">Especialidades</Link>
              </li>
              <li>
                <Link href="#profissionais">Profissionais</Link>
              </li>
              <li>
                <Link href="/login">Entrar</Link>
              </li>
            </ul>
          </nav>

          <section className={styles.home__footer_contact}>
            <h3>Contatos</h3>
            <ul>
              <li>(11) 9 9999-8888</li>
              <li>suporte@medlink.com</li>
              <li>
                Av. Agamenon Magalhães, 1000
                <br />
                Centro - São Paulo-SP
              </li>
            </ul>
          </section>
        </div>

        <div className={styles.home__footer_legal}>
          <div className={`${styles.home__container} ${styles.home__footer_legal_inner}`}>
            <Link href="/" className={styles.home__legal_link}>
              Termos de serviço
            </Link>
            <Link href="/" className={styles.home__legal_link}>
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}