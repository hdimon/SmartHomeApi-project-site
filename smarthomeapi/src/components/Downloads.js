import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Linux',
    //Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        <a href="https://github.com/hdimon/SmartHomeApi/releases/download/1.4.0-alpha-8/1.4.0-alpha-8_linux-x64.zip">1.4.0-alpha-8 x64</a>
      </>
    ),
  },
  {
    title: 'Windows',
    //Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
          <div><a href="https://github.com/hdimon/SmartHomeApi/releases/download/1.4.0-alpha-8/1.4.0-alpha-8_win-x64.zip">1.4.0-alpha-8 x64</a></div>
          <div><div><a href="https://github.com/hdimon/SmartHomeApi/releases/download/1.4.0-alpha-8/1.4.0-alpha-8_win-x86.zip">1.4.0-alpha-8 x86</a></div></div>
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      {/*<div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>*/}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
