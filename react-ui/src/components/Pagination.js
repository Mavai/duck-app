import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

const Pagination = ({ state, handlePageChange, pageCount }) => {

  let pages = []
  for (let i = state.currentPage - 2; i <= state.currentPage + 2; i++) {
    if (i > 0 && i <= pageCount) pages.push(i.toString())
  }

  return (
    <Menu floated='right' pagination>
      <Menu.Item name='previous' disabled={state.currentPage === 1} as='a' onClick={handlePageChange} icon>
        <Icon name='left chevron' />
      </Menu.Item>
      {pages.map(pageNumber => 
        <Menu.Item
          key={pageNumber}
          as='a'
          name={pageNumber}
          active={Number(pageNumber) === state.currentPage}
          onClick={handlePageChange}
        >{pageNumber}</Menu.Item>
      )}
      <Menu.Item name='next' disabled={state.currentPage >= pageCount} as='a' onClick={handlePageChange} icon>
        <Icon name='right chevron' />
      </Menu.Item>
    </Menu>
  )
}

export default Pagination