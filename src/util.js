// Split the array into halves and merge them recursively
export const mergeSort = (arr, callBack) => {
    if (arr.length === 1) {
      // return once we hit an array with a single item
      return arr
    }

    const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
    const left = arr.slice(0, middle) // items on the left side
    const right = arr.slice(middle) // items on the right side

    return merge(
      mergeSort(left, callBack),
      mergeSort(right, callBack),
      callBack
    )
}

// compare the arrays item by item and return the concatenated result
function merge (left, right, callBack) {
  let result = []
  let indexLeft = 0
  let indexRight = 0

  while (indexLeft < left.length && indexRight < right.length) {
    if (callBack(left[indexLeft], right[indexRight])) {
      result.push(left[indexLeft])
      indexLeft++
    } else {
      result.push(right[indexRight])
      indexRight++
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}
