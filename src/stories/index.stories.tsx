import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { NonRoute } from './NonRoute.stories'

storiesOf('Router', module).add('No Route', () => <NonRoute />)
