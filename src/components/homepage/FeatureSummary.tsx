import card from '../../assets/images/CreditCard.png';
import support from '../../assets/images/Headphones.png';
import packaging from '../../assets/images/Package.png';
import trophy from '../../assets/images/Trophy.svg';

const features = [
  {
    icon: packaging,
    title: 'Faster Delivery',
    subtitle: 'Delivery within 24 hours',
    color: '#dbeafe',
    iconBg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
  },
  {
    icon: trophy,
    title: '24h Easy Return',
    subtitle: '100% money back guarantee',
    color: '#dcfce7',
    iconBg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
  },
  {
    icon: card,
    title: 'Secure Payment',
    subtitle: 'Your money is always safe',
    color: '#fef9c3',
    iconBg: 'linear-gradient(135deg, #fefce8, #fef9c3)',
  },
  {
    icon: support,
    title: 'Support 24/7',
    subtitle: 'Live chat & message support',
    color: '#fce7f3',
    iconBg: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
  },
];

const FeatureSummary = () => {
  return (
    <div
      className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      data-aos="fade-up"
      data-aos-duration="700"
    >
      {features.map((feat, i) => (
        <div
          key={i}
          className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-5 border border-gray-100
                     hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          data-aos="fade-up"
          data-aos-delay={i * 80}
        >
          {/* Icon box */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: feat.iconBg }}
          >
            <img src={feat.icon} alt={feat.title} className="w-7 h-7 object-contain" />
          </div>
          {/* Text */}
          <div>
            <h3 className="text-sm font-700 text-custom-black font-semibold leading-tight mb-0.5">
              {feat.title}
            </h3>
            <p className="text-xs text-graish leading-snug">{feat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureSummary;
