// Componente de um item individual da lista
function HorizontalItem({title, subtitle, imageUrl}) {
  return (
    <div className="horizontal-item">
      <img 
        src={imageUrl} 
        alt={title} 
        className="circle-image"
      />
      <div className="horizontal-item-text">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

// Componente principal da seção
export function HorizontalList() {
  return (
    <section className="horizontal-list-section">
      <span className="accent-text">MILLENNIUM - Time Capsule</span>
      <div className="horizontal-list-container">

        <HorizontalItem title="26th Annual Millennium" subtitle="2024" imageUrl=""/>
        <HorizontalItem title="25th Annual Millennium" subtitle="2023" imageUrl=""/>
        <HorizontalItem title="24th Annual Millennium" subtitle="2022" imageUrl=""/>
        <HorizontalItem title="23rd Annual Millennium" subtitle="2021"imageUrl=""/>
        <HorizontalItem title="22nd Annual Millennium" subtitle="2020" imageUrl=""/>
        <HorizontalItem title="21st Annual Millennium" subtitle="2019" imageUrl=""/>
        <HorizontalItem title="20th Annual Millennium" subtitle="2018" imageUrl=""/>
        <HorizontalItem title="19th Annual Millennium" subtitle="2017" imageUrl=""/>
        <HorizontalItem title="18th Annual Millennium" subtitle="2016" imageUrl=""/>
        <HorizontalItem title="17th Annual Millennium" subtitle="2015" imageUrl=""/>
        <HorizontalItem title="16th Annual Millennium" subtitle="2014" imageUrl=""/>
        <HorizontalItem title="15th Annual Millennium" subtitle="2013" imageUrl=""/>
        <HorizontalItem title="14th Annual Millennium" subtitle="2012" imageUrl=""/>
        <HorizontalItem title="13th Annual Millennium" subtitle="2011" imageUrl=""/>
        <HorizontalItem title="12th Annual Millennium" subtitle="2010" imageUrl=""/>
        <HorizontalItem title="11th Annual Millennium" subtitle="2009" imageUrl=""/>
        <HorizontalItem title="10th Annual Millennium" subtitle="2008" imageUrl=""/>
        <HorizontalItem title="9th Annual Millennium" subtitle="2007" imageUrl=""/>
        <HorizontalItem title="8th Annual Millennium" subtitle="2006" imageUrl=""/>
        <HorizontalItem title="7th Annual Millennium" subtitle="2005" imageUrl=""/>
        <HorizontalItem title="6th Annual Millennium" subtitle="2004" imageUrl=""/>
        <HorizontalItem title="5th Annual Millennium" subtitle="2003" imageUrl=""/>
        <HorizontalItem title="4th Annual Millennium" subtitle="2002" imageUrl=""/>
        <HorizontalItem title="3rd Annual Millennium" subtitle="2001" imageUrl=""/>
        <HorizontalItem title="2nd Annual Millennium" subtitle="2000" imageUrl=""/>
        <HorizontalItem title="1st Annual Millennium" subtitle="1999" imageUrl=""/>
        
      </div>
    </section>
  );
}