import LoaderTime from "../common/LoaderTime.jsx";

const MeasurerImage = ({ currentData }) => (
  <div className="h-full overflow-hidden rounded-xl shadow-2xl border border-emerald-400/20 group flex items-center justify-center">
    {currentData.locationImg ? (
      <img
        src={currentData.locationImg}
        alt={currentData.locationName}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <LoaderTime />
    )}
  </div>
);

export default MeasurerImage;
