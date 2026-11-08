type StepperProps = {
  id: string
  label: string
  value: number
  min?: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

export function Stepper({
  id,
  label,
  value,
  min = 0,
  step = 1,
  suffix,
  onChange,
}: StepperProps) {
  const dec = () => onChange(Math.max(min, round(value - step, step)))
  const inc = () => onChange(round(value + step, step))

  return (
    <div className="field stepper">
      <label htmlFor={id}>{label}</label>
      <div className="stepper-controls">
        <button className="btn btn-secondary stepper-btn" type="button" onClick={dec} aria-label={`Уменьшить ${label}`}>
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode={step < 1 ? 'decimal' : 'numeric'}
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : min}
          onChange={(e) => onChange(Number(e.target.value) || min)}
        />
        <button className="btn btn-secondary stepper-btn" type="button" onClick={inc} aria-label={`Увеличить ${label}`}>
          +
        </button>
      </div>
      {suffix ? <span className="tiny muted stepper-suffix">{suffix}</span> : null}
    </div>
  )
}

function round(value: number, step: number): number {
  const precision = String(step).includes('.') ? String(step).split('.')[1].length : 0
  return Number(value.toFixed(precision))
}
