import { storiesOf } from '@storybook/react'
import NonRoute from './NonRoute.stories'
import Formulas from './Formula.stories'
import './index.scss'
import Frozen from './Frozen.stories'

storiesOf('Formulas', module).add('Formula', Formulas)
// .addParameters({ info: { inline: true } })

storiesOf('Frozen Panes', module).add('Frozen', Frozen)
// .addParameters({ info: { inline: true } })

storiesOf('Router', module).add('No Route', NonRoute)
// .addParameters({ info: { inline: true } })
