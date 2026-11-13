import React from 'react';
import type {
  Question,
  UniversalChoiceQuestion,
  OrderingAndFormulaQuestion,
  PairMatchingQuestion,
  SwipeGroupingQuestion,
  NumpadClosestQuestion,
  MultiSelectBubbleQuestion,
  StepperBalanceQuestion,
  SpotTheBugQuestion,
  ProgressiveCluesQuestion,
  TargetCombinationQuestion,
  ChainConversionQuestion,
  MatrixToggleQuestion,
  SliderQuestion as SliderQuestionType,
  HotspotQuestion,
} from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

// 14 Soru Mekaniği Bileşenleri
import UniversalChoice from './UniversalChoice';
import OrderingAndFormula from './OrderingAndFormula';
import PairMatching from './PairMatching';
import SwipeGrouping from './SwipeGrouping';
import NumpadClosest from './NumpadClosest';
import MultiSelectBubble from './MultiSelectBubble';
import StepperBalance from './StepperBalance';
import SpotTheBug from './SpotTheBug';
import ProgressiveClues from './ProgressiveClues';
import TargetCombination from './TargetCombination';
import ChainConversion from './ChainConversion';
import MatrixToggle from './MatrixToggle';
import SliderQuestion from './SliderQuestion';
import Hotspot from './Hotspot';

export const QuestionRenderer: React.FC<QuestionComponentProps<Question>> = ({
  question,
  onSubmit,
  disabled,
}) => {
  const commonProps = {
    key: question.id,
    onSubmit,
    disabled,
  };

  switch (question.type) {
    case 'universal_choice':
      return (
        <UniversalChoice
          {...commonProps}
          question={question as UniversalChoiceQuestion}
        />
      );

    case 'ordering_and_formula':
      return (
        <OrderingAndFormula
          {...commonProps}
          question={question as OrderingAndFormulaQuestion}
        />
      );

    case 'pair_matching':
      return (
        <PairMatching
          {...commonProps}
          question={question as PairMatchingQuestion}
        />
      );

    case 'swipe_grouping':
      return (
        <SwipeGrouping
          {...commonProps}
          question={question as SwipeGroupingQuestion}
        />
      );

    case 'numpad_closest':
      return (
        <NumpadClosest
          {...commonProps}
          question={question as NumpadClosestQuestion}
        />
      );

    case 'multi_select_bubble':
      return (
        <MultiSelectBubble
          {...commonProps}
          question={question as MultiSelectBubbleQuestion}
        />
      );

    case 'stepper_balance':
      return (
        <StepperBalance
          {...commonProps}
          question={question as StepperBalanceQuestion}
        />
      );

    case 'spot_the_bug':
      return (
        <SpotTheBug
          {...commonProps}
          question={question as SpotTheBugQuestion}
        />
      );

    case 'progressive_clues':
      return (
        <ProgressiveClues
          {...commonProps}
          question={question as ProgressiveCluesQuestion}
        />
      );

    case 'target_combination':
      return (
        <TargetCombination
          {...commonProps}
          question={question as TargetCombinationQuestion}
        />
      );

    case 'chain_conversion':
      return (
        <ChainConversion
          {...commonProps}
          question={question as ChainConversionQuestion}
        />
      );

    case 'matrix_toggle':
      return (
        <MatrixToggle
          {...commonProps}
          question={question as MatrixToggleQuestion}
        />
      );

    case 'slider':
      return (
        <SliderQuestion
          {...commonProps}
          question={question as SliderQuestionType}
        />
      );

    case 'hotspot':
      return (
        <Hotspot
          {...commonProps}
          question={question as HotspotQuestion}
        />
      );

    default:
      return (
        <div className="p-6 text-center text-game-wrong bg-isler-surface rounded-2xl border border-game-wrong/40 font-mono">
          Desteklenmeyen soru tipi: {(question as { type?: string })?.type}
        </div>
      );
  }
};

export default QuestionRenderer;
