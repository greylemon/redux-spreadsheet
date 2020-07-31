import { storiesOf } from '@storybook/react'
import NonRoute from './NonRoute.stories'
import Formulas from './Formula.stories'
import './index.scss'

storiesOf('Formulas', module)
  .add('Formula', Formulas)
  .addParameters({ info: { inline: true } })

storiesOf('Router', module)
  .add('No Route', NonRoute)
  .addParameters({ info: { inline: true } })
