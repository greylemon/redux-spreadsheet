import { storiesOf } from '@storybook/react'
import { NonRoute } from './NonRoute.stories'
import { Formulas } from './Formula.stories'

storiesOf('Router', module)
  .add('No Route', NonRoute)
  .addParameters({ info: { inline: true } })

storiesOf('Formula', module)
  .add('Formula', Formulas)
  .addParameters({ info: { inline: true } })
