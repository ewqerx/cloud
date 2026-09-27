/**
 * Event-horizon backdrop drawn in CSS (see `.bh-*` in index.css).
 *
 * The drawing is static and blurred once; the glow pulse lives on a sibling
 * layer outside the filter so animating it never forces the blur to re-raster.
 */
export function BlackHole() {
  return (
    <div className="bh-anchor">
      <div className="bh-pulse" />
      <div className="bh">
        <div className="bh-lens" />
        <div className="bh-disk" />
        <div className="bh-shadow" />
        <div className="bh-photon" />
        <div className="bh-disk bh-disk-front" />
      </div>
    </div>
  )
}
