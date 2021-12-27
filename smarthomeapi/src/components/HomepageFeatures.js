import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const OsDownloadsList = [
  {
    title: 'Easy to Install',
    //Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Based on .NET 6 SmartHomeApi is cross-platform software which easy to run on Linux or Windows.
      </>
    ),
  },
  {
    title: 'Extendable and powerful',
    //Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        SmartHomeApi is just core with minimal functionality but with plugins it can be extremely powerful
        allowing you to implement literally whatever you want.
      </>
    ),
  },
  {
    title: 'Easy to Integrate',
    //Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You don't have to use only SmartHomeApi. You could implement only some of your automations which are difficult to do in other systems
        and integrate them via HTTP, MQTT or other protocols.
      </>
    ),
  },
];

function Os({Svg, title, description}) {
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

export default function Downloads() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {OsDownloadsList.map((props, idx) => (
            <Os key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
