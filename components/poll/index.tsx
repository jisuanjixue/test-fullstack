import {useState} from 'react';
import './index.scss';

export const Poll = (props) => {
  const {dataSource: item, isAdmin, onVote, onDelete} = props;
    const [title, setTitle] = useState('');
    return (
      <div className="item">
        <p>{item.title}----</p>
        <p>voted: {item.poll}</p>
        <button onClick={onVote} id={item._id} value={item.poll}>vote</button>
        {
          isAdmin && <button onClick={onDelete} id={item._id}>del</button>
        }
      </div>
    )
}