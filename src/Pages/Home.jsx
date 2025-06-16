import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/Home.css'; 
const Home = () => {
  return (
    <>
      <Header title="Home" />
      <main className="home-main">
        <section className="home-content">
          <h2 className="home-heading">Welcome</h2>
          <p className="home-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, optio? Impedit voluptatem
            repellat nostrum temporibus iusto voluptate, atque optio facere distinctio enim esse
            consequatur eligendi expedita quidem minus dolor nam!
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
