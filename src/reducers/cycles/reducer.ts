import { produce, Draft } from 'immer'
import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = getCurrentCycleIndex(state)
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(
        state,
        updateCycleDateField(currentCycleIndex, 'interruptedDate'),
      )
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = getCurrentCycleIndex(state)
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(
        state,
        updateCycleDateField(currentCycleIndex, 'finishedDate'),
      )
    }
    default:
      return state
  }
}

function updateCycleDateField(
  currentCycleIndex: number,
  field: 'finishedDate' | 'interruptedDate',
) {
  return (draft: Draft<CyclesState>) => {
    draft.activeCycleId = null
    draft.cycles[currentCycleIndex][field] = new Date()
  }
}

function getCurrentCycleIndex(state: CyclesState) {
  return state.cycles.findIndex((cycle) => cycle.id === state.activeCycleId)
}
