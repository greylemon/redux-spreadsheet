import { storiesOf } from '@storybook/react'
import { NonRoute } from './NonRoute.stories'

storiesOf('Router', module)
  .add('No Route', NonRoute)
  .addParameters({ info: { inline: true } })
