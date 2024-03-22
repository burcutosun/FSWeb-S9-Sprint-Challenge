import React from 'react';
import AppFunctional from './AppFunctional';
import {render,fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('AppFunctional Component Tests', ()=>{

  test('Başlıkların ekranda göründüğünü test eder.',()=>{
    const { container } = render(<AppFunctional />);
    const coordinates = container.querySelector('#coordinates');
    const steps = container.querySelector('#steps');
    expect(coordinates.textContent).toBe('Koordinatlar (2,2)')
    expect(steps.textContent).toBe('0 kere ilerlediniz')
  })
  test('Butonların görünür metinlerini kontrol eder.', () => {
    const { container } = render(<AppFunctional />);
    up = container.querySelector('#up');
    down = container.querySelector('#down');
    left = container.querySelector('#left');
    right = container.querySelector('#right');
    reset = container.querySelector('#reset');
    expect(up.textContent).toBe('YUKARI');
    expect(down.textContent).toBe('AŞAĞI');
    expect(left.textContent).toBe('SOL');
    expect(right.textContent).toBe('SAĞ');
    expect(reset.textContent).toBe('reset');
  });

  test('Inputa metin girildiğinde value değişimini test eder.', () => {
    const { container } = render(<AppFunctional />);
    email = container.querySelector('#email');
    fireEvent.change(email, { target: { value: 'test@mail.com' } });
    expect(email.value).toBe('test@mail.com');
  });

  test('İki kere sol butonuna tıklandığında mesajın değiştiğini kontrol eder.', () => {
    const { container } = render(<AppFunctional />);
    left = container.querySelector('#left');
    fireEvent.click(left);
    fireEvent.click(left);
    expect(message.textContent).toBe("Sola gidemezsiniz");
  });

  test('Reset butonunun çalıştığını ve adımların sıfırlandığını kontrol eder.', () => {
    const { container } = render(<AppFunctional />);  
    up = container.querySelector('#up');    
    reset = container.querySelector('#reset');
    fireEvent.click(up);
    fireEvent.click(reset);
    expect(steps.textContent).toBe('0 kere ilerlediniz');
  });
})